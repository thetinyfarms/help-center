import { writeFileSync } from "fs";
import type { NarrationSegment, AudioResult } from "./types";
import { calculateSegmentTimings } from "./narration";

export async function generateAudio(
  text: string,
  clipPath: string,
  segments: NarrationSegment[] | null = null
): Promise<AudioResult> {
  const voiceId = process.env.ELEVENLABS_VOICE_ID || "JBFqnCBsd6RMkjVDRZzb";
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    throw new Error("ELEVENLABS_API_KEY not set");
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ElevenLabs API error: ${error}`);
  }

  const data = await response.json();

  // Decode and save audio
  const audioBuffer = Buffer.from(data.audio_base64, "base64");
  writeFileSync(clipPath, audioBuffer);

  // Get duration and timing alignment
  const alignment = data.alignment || {};
  const charStartTimes: number[] = alignment.character_start_times_seconds || [];
  const charEndTimes: number[] = alignment.character_end_times_seconds || [];
  const characters: string[] = alignment.characters || [];

  console.error(
    `[video] ElevenLabs alignment: ${charStartTimes.length} char times`
  );

  const durationSec =
    charEndTimes.length > 0 ? charEndTimes[charEndTimes.length - 1] : 3;
  const durationMs = Math.round(durationSec * 1000);

  // Calculate segment timings if segments provided
  let segmentTimings = null;
  if (segments && segments.length > 0) {
    segmentTimings = calculateSegmentTimings(segments, charStartTimes);
    console.error(
      `[video] Segment timings calculated for ${segmentTimings.length} segments`
    );
  }

  return {
    durationMs,
    durationSec,
    charStartTimes,
    charEndTimes,
    characters,
    segmentTimings,
  };
}
