import { NextRequest, NextResponse } from "next/server";

const VALID_DEVICES = ["tinyfarm-v1_0", "tinyfarm-v1_5"];

interface GitHubRelease {
  tag_name: string;
  assets: { name: string; browser_download_url: string }[];
}

let cachedRelease: { data: GitHubRelease; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000;

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

  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  const data = await res.json();
  cachedRelease = { data, timestamp: Date.now() };
  return data;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ device: string }> }
) {
  const { device } = await params;

  if (!VALID_DEVICES.includes(device)) {
    return NextResponse.json({ error: "Invalid device" }, { status: 400 });
  }

  try {
    const release = await getLatestRelease();
    const asset = release.assets.find(
      (a) => a.name === `firmware-${device}.bin`
    );

    if (!asset) {
      return NextResponse.json(
        { error: `No firmware found for ${device}` },
        { status: 404 }
      );
    }

    // Stream the binary from GitHub through our server
    const upstream = await fetch(asset.browser_download_url);
    if (!upstream.ok) {
      return NextResponse.json(
        { error: "Failed to download firmware from GitHub" },
        { status: 502 }
      );
    }

    return new Response(upstream.body, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Cache-Control": "public, max-age=300",
        ...(upstream.headers.get("content-length")
          ? { "Content-Length": upstream.headers.get("content-length")! }
          : {}),
      },
    });
  } catch (error) {
    console.error("Firmware proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch firmware" },
      { status: 500 }
    );
  }
}
