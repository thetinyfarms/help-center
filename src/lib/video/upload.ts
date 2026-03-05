import { readFileSync } from "fs";
import { sleep } from "./browser";

export async function uploadToMux(videoPath: string): Promise<string> {
  const tokenId = process.env.MUX_TOKEN_ID;
  const tokenSecret = process.env.MUX_TOKEN_SECRET;

  if (!tokenId || !tokenSecret) {
    throw new Error("MUX_TOKEN_ID and MUX_TOKEN_SECRET must be set");
  }

  const auth = Buffer.from(`${tokenId}:${tokenSecret}`).toString("base64");

  // Create upload
  const createResponse = await fetch("https://api.mux.com/video/v1/uploads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      new_asset_settings: {
        playback_policy: ["public"],
        video_quality: "basic",
      },
      cors_origin: "*",
    }),
  });

  const uploadData = await createResponse.json();
  const uploadUrl = uploadData.data.url;
  const uploadId = uploadData.data.id;

  // Upload file
  const videoBuffer = readFileSync(videoPath);
  await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": "video/webm" },
    body: videoBuffer,
  });

  // Wait for processing
  await sleep(5000);

  // Get asset ID
  const uploadStatusResponse = await fetch(
    `https://api.mux.com/video/v1/uploads/${uploadId}`,
    {
      headers: { Authorization: `Basic ${auth}` },
    }
  );
  const uploadStatus = await uploadStatusResponse.json();
  const assetId = uploadStatus.data.asset_id;

  // Get playback ID
  const assetResponse = await fetch(
    `https://api.mux.com/video/v1/assets/${assetId}`,
    {
      headers: { Authorization: `Basic ${auth}` },
    }
  );
  const assetData = await assetResponse.json();
  const playbackId = assetData.data.playback_ids[0].id;

  return `https://stream.mux.com/${playbackId}`;
}
