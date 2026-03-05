import { NextRequest, NextResponse } from "next/server";

const VALID_DEVICES: Record<string, string> = {
  "tinyfarm-v1_0": "tinyfarm 1.0",
  "tinyfarm-v1_5": "tinyfarm 1.5",
};

interface GitHubRelease {
  tag_name: string;
  assets: { name: string; browser_download_url: string }[];
}

let cachedRelease: { data: GitHubRelease; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getLatestRelease(): Promise<GitHubRelease> {
  if (cachedRelease && Date.now() - cachedRelease.timestamp < CACHE_TTL) {
    return cachedRelease.data;
  }

  const res = await fetch(
    "https://api.github.com/repos/thetinyfarms/tinyfarms-releases/releases/latest",
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
        ...(process.env.GITHUB_TOKEN
          ? { Authorization: `token ${process.env.GITHUB_TOKEN}` }
          : {}),
      },
      next: { revalidate: 300 },
    }
  );

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`);
  }

  const data = await res.json();
  cachedRelease = { data, timestamp: Date.now() };
  return data;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ device: string }> }
) {
  const { device } = await params;

  if (!VALID_DEVICES[device]) {
    return NextResponse.json(
      { error: "Invalid device. Use tinyfarm-v1_0 or tinyfarm-v1_5" },
      { status: 400 }
    );
  }

  try {
    const release = await getLatestRelease();
    const version = release.tag_name;
    const firmwareAsset = release.assets.find(
      (a) => a.name === `firmware-${device}.bin`
    );

    if (!firmwareAsset) {
      return NextResponse.json(
        { error: `No firmware found for ${device} in release ${version}` },
        { status: 404 }
      );
    }

    const origin = request.nextUrl.origin;

    const manifest = {
      name: `${VALID_DEVICES[device]} Software`,
      version,
      builds: [
        {
          chipFamily: "ESP32-S3",
          parts: [
            { path: `${origin}/firmware/bootloader.bin`, offset: 0 },
            { path: `${origin}/firmware/partitions.bin`, offset: 0x8000 },
            {
              path: `${origin}/firmware/ota_data_initial.bin`,
              offset: 0xe000,
            },
            {
              path: `${origin}/api/firmware/${device}`,
              offset: 0x20000,
            },
          ],
        },
      ],
    };

    return NextResponse.json(manifest, {
      headers: {
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (error) {
    console.error("Failed to fetch release:", error);
    return NextResponse.json(
      { error: "Failed to fetch latest firmware release" },
      { status: 500 }
    );
  }
}
