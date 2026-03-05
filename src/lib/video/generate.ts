import { execSync } from "child_process";
import {
  writeFileSync,
  mkdirSync,
  appendFileSync,
  unlinkSync,
} from "fs";
import { join } from "path";
import { homedir } from "os";

import { agentBrowser, sleep } from "./browser";
import { generateNarration } from "./narration";
import { generateAudio } from "./audio";
import { uploadToMux } from "./upload";
import type {
  VideoPage,
  PageData,
  ClipData,
  VideoResult,
  ProgressCallback,
} from "./types";

const SESSION_BASE = join(
  homedir(),
  "Videos",
  "agent-recordings"
);

export async function createNarratedRecording(
  persona: string,
  pages: VideoPage[],
  onProgress?: ProgressCallback
): Promise<VideoResult> {
  const progress = onProgress || (() => {});

  const sessionId = Date.now();
  const sessionDir = join(SESSION_BASE, `session-${sessionId}`);
  mkdirSync(sessionDir, { recursive: true });

  const debugLogPath = join(sessionDir, "debug.log");
  const logDebug = (msg: string) => {
    const line = `[${new Date().toISOString()}] ${msg}\n`;
    console.error(`[video] ${msg}`);
    appendFileSync(debugLogPath, line);
  };

  progress({
    type: "session:start",
    message: `Session started: ${sessionDir}`,
    data: { sessionId, sessionDir, persona, pageCount: pages.length },
  });

  const videoPath = join(sessionDir, "recording.webm");
  const clips: ClipData[] = [];
  const pageData: PageData[] = [];

  try {
    // === RESEARCH PASS ===
    progress({ type: "research:start", message: "Starting research pass..." });

    agentBrowser(`set viewport 1280 720`);
    agentBrowser(`open "${pages[0].url}" --headed`, { timeout: 60000 });
    await sleep(2000);

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      progress({
        type: "research:page",
        message: `Researching page ${i + 1}/${pages.length}: ${page.url}`,
        data: { pageIndex: i, url: page.url },
      });

      if (i > 0) {
        agentBrowser(`open "${page.url}"`, { timeout: 60000 });
        await sleep(2000);
      }

      let narrationData;

      if (page.narration) {
        logDebug(`Using provided narration for page ${i + 1}`);
        narrationData = {
          segments: [{ text: page.narration, scrollTo: "top" }],
        };
      } else {
        logDebug(`Taking snapshot of page ${i + 1}...`);
        const snapshotJson = agentBrowser(`snapshot --json`);

        const jsonStart = snapshotJson.indexOf("{");
        const snapshotData = JSON.parse(snapshotJson.substring(jsonStart));
        const snapshot = snapshotData.data.snapshot;
        const refs = snapshotData.data.refs;

        logDebug(`Snapshot has ${Object.keys(refs).length} refs`);

        progress({
          type: "narration:generating",
          message: `Generating narration for page ${i + 1}...`,
          data: { pageIndex: i },
        });

        narrationData = await generateNarration(
          persona,
          page.url,
          snapshot,
          refs
        );
      }

      logDebug(`Generated ${narrationData.segments.length} segments`);
      for (const seg of narrationData.segments) {
        logDebug(
          `  Segment: "${seg.text.substring(0, 50)}..." -> scrollTo: ${seg.scrollTo}`
        );
      }

      pageData.push({
        url: page.url,
        narrationData,
        highlights: page.highlights,
        highlightDefaults: page.highlightDefaults,
      });
    }

    agentBrowser(`close`);
    await sleep(1000);

    progress({
      type: "research:done",
      message: `Research complete for ${pages.length} pages`,
    });

    // === AUDIO GENERATION ===
    progress({ type: "audio:start", message: "Generating audio..." });

    for (let i = 0; i < pageData.length; i++) {
      const clipPath = join(sessionDir, `clip_${i + 1}.mp3`);
      progress({
        type: "audio:page",
        message: `Generating audio for page ${i + 1}/${pageData.length}...`,
        data: { pageIndex: i },
      });

      const segments = pageData[i].narrationData.segments;
      const fullNarration = segments.map((s) => s.text).join(" ");

      const audioData = await generateAudio(fullNarration, clipPath, segments);
      clips.push({
        clipNum: i + 1,
        clipPath,
        segments,
        ...audioData,
      });

      logDebug(`Audio duration: ${audioData.durationSec.toFixed(2)}s`);
      if (audioData.segmentTimings) {
        for (const st of audioData.segmentTimings) {
          logDebug(
            `  Segment at ${st.startTimeSec.toFixed(2)}s: scroll to ${st.scrollTo}`
          );
        }
      }
    }

    progress({ type: "audio:done", message: "Audio generation complete" });

    // === PERFORMANCE PASS (RECORDING) ===
    progress({
      type: "recording:start",
      message: "Starting screen recording...",
    });

    agentBrowser(`set viewport 1280 720`);
    agentBrowser(`open "${pageData[0].url}" --headed`, { timeout: 60000 });
    await sleep(2000);

    agentBrowser(`record start "${videoPath}"`);

    const recordingStartMs = Date.now();
    const marks: { clipNum: number; offsetMs: number; durationMs: number }[] =
      [];

    for (let i = 0; i < pageData.length; i++) {
      const { url } = pageData[i];
      const clip = clips[i];

      progress({
        type: "recording:page",
        message: `Recording page ${i + 1}/${pageData.length}: ${url}`,
        data: { pageIndex: i, url },
      });

      if (i > 0) {
        agentBrowser(`open "${url}"`, { timeout: 60000 });
        await sleep(1000);
      }

      const offsetMs = Date.now() - recordingStartMs;
      marks.push({ clipNum: clip.clipNum, offsetMs, durationMs: clip.durationMs });
      logDebug(`Marked clip ${clip.clipNum} at offset ${offsetMs}ms`);

      agentBrowser(
        `eval "document.documentElement.style.scrollBehavior = 'smooth'"`
      );
      const pageDimensions = agentBrowser(
        `eval "JSON.stringify({ scrollHeight: document.body.scrollHeight, viewportHeight: window.innerHeight, scrollable: document.body.scrollHeight > window.innerHeight })"`
      );
      logDebug(`Page dimensions: ${pageDimensions}`);

      // Content-aware scrolling based on segment timings
      if (clip.segmentTimings && clip.segmentTimings.length > 0) {
        logDebug(
          `Using content-aware scrolling with ${clip.segmentTimings.length} segments`
        );

        const segmentStartTime = Date.now();

        for (const segment of clip.segmentTimings) {
          const elapsedMs = Date.now() - segmentStartTime;
          const waitMs = segment.startTimeMs - elapsedMs;
          if (waitMs > 0) {
            await sleep(waitMs);
          }

          logDebug(
            `Scrolling to: ${segment.scrollTo} at ${segment.startTimeSec.toFixed(2)}s`
          );

          if (segment.scrollTo === "top") {
            agentBrowser(
              `eval "window.scrollTo({ top: 0, behavior: 'smooth' })"`
            );
          } else if (segment.scrollTo === "bottom") {
            agentBrowser(
              `eval "window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })"`
            );
          } else {
            try {
              agentBrowser(`scrollintoview @${segment.scrollTo}`);
              logDebug(`Scrolled to ref @${segment.scrollTo}`);
            } catch (e: unknown) {
              const err = e as Error;
              logDebug(
                `Failed to scroll to ref @${segment.scrollTo}: ${err.message}`
              );
            }
          }
        }

        const totalElapsed = Date.now() - segmentStartTime;
        const remainingMs = clip.durationMs - totalElapsed;
        if (remainingMs > 0) {
          await sleep(remainingMs);
        }
      } else {
        logDebug("WARNING: Using fallback scrolling (no segment timings)");
        await sleep(clip.durationMs);
      }
    }

    agentBrowser(`record stop`);
    agentBrowser(`close`);
    await sleep(1000);

    // Write marks file
    const marksPath = join(sessionDir, "marks.txt");
    const marksContent = marks
      .map((m) => `${m.clipNum} ${m.offsetMs} ${m.durationMs}`)
      .join("\n");
    writeFileSync(marksPath, marksContent);

    progress({
      type: "recording:done",
      message: "Screen recording complete",
    });

    // === POST-PROCESSING ===
    progress({
      type: "postprocess:start",
      message: "Post-processing video...",
    });

    const nullDev = process.platform === "win32" ? "NUL" : "/dev/null";
    const concatListPath = join(sessionDir, "concat_list.txt");
    let concatList = "";

    for (const mark of marks) {
      const startSec = (mark.offsetMs / 1000).toFixed(3);
      const durationSec = (mark.durationMs / 1000).toFixed(3);
      const segmentPath = join(sessionDir, `segment_${mark.clipNum}.mp4`);

      logDebug(
        `Extracting segment ${mark.clipNum}: ${startSec}s for ${durationSec}s`
      );

      execSync(
        `ffmpeg -y -i "${videoPath}" -ss ${startSec} -t ${durationSec} -c:v libx264 -preset fast -crf 23 "${segmentPath}" 2>${nullDev}`
      );

      concatList += `file '${segmentPath}'\n`;
    }

    writeFileSync(concatListPath, concatList);

    // Concatenate segments
    logDebug("Concatenating segments...");
    const concatPath = join(sessionDir, "concat.mp4");
    execSync(
      `ffmpeg -y -f concat -safe 0 -i "${concatListPath}" -c copy "${concatPath}" 2>${nullDev}`
    );

    // Mix audio
    logDebug("Mixing audio...");
    let audioInputs = "";
    let audioFilter = "";
    let audioLabels = "";
    let cumulativeOffsetMs = 0;

    for (let i = 0; i < clips.length; i++) {
      const clip = clips[i];
      const inputNum = i + 1;

      audioInputs += ` -i "${clip.clipPath}"`;
      audioFilter += `[${inputNum}]adelay=${cumulativeOffsetMs}|${cumulativeOffsetMs}[a${inputNum}];`;
      audioLabels += `[a${inputNum}]`;

      const segmentPath = join(sessionDir, `segment_${clip.clipNum}.mp4`);
      const segDuration = execSync(
        `ffprobe -v error -show_entries format=duration -of csv=p=0 "${segmentPath}" 2>${nullDev}`
      )
        .toString()
        .trim();
      cumulativeOffsetMs += Math.round(parseFloat(segDuration) * 1000);
    }

    audioFilter += `${audioLabels}amix=inputs=${clips.length}:duration=longest[aout]`;

    const outputPath = join(sessionDir, "output.mp4");
    execSync(
      `ffmpeg -y -i "${concatPath}"${audioInputs} -filter_complex "${audioFilter}" -map 0:v -map "[aout]" -c:v copy -c:a aac "${outputPath}" 2>${nullDev}`
    );

    logDebug(`Output created: ${outputPath}`);

    progress({
      type: "postprocess:done",
      message: "Post-processing complete",
      data: { outputPath },
    });

    // === UPLOAD ===
    progress({ type: "upload:start", message: "Uploading to Mux..." });

    const playbackUrl = await uploadToMux(outputPath);

    logDebug(`Upload complete: ${playbackUrl}`);

    // Cleanup intermediate files
    for (const mark of marks) {
      try {
        unlinkSync(join(sessionDir, `segment_${mark.clipNum}.mp4`));
      } catch {}
    }
    try {
      unlinkSync(concatPath);
      unlinkSync(concatListPath);
    } catch {}

    const result: VideoResult = {
      success: true,
      playbackUrl,
      sessionDir,
      pagesRecorded: pages.length,
    };

    progress({
      type: "complete",
      message: "Video generation complete!",
      data: { playbackUrl, sessionDir, pagesRecorded: pages.length },
    });

    return result;
  } catch (error: unknown) {
    const err = error as Error;
    console.error(`[video] Error: ${err.message}`);
    try {
      agentBrowser(`close`);
    } catch {}

    progress({
      type: "error",
      message: `Error: ${err.message}`,
      data: { error: err.message },
    });

    throw error;
  }
}
