import { NextRequest } from "next/server";
import { createNarratedRecording } from "@/lib/video/generate";
import type { VideoPage } from "@/lib/video/types";

export const maxDuration = 300; // 5 minute timeout for long recordings

export async function POST(request: NextRequest) {
  let body: { persona: string; pages: VideoPage[] };

  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!body.persona || !body.pages?.length) {
    return new Response(
      JSON.stringify({ error: "persona and pages[] are required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      function sendEvent(type: string, data: unknown) {
        const payload = JSON.stringify({ type, ...((data as Record<string, unknown>) || {}) });
        controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
      }

      createNarratedRecording(body.persona, body.pages, (event) => {
        sendEvent(event.type, { message: event.message, ...event.data });
      })
        .then((result) => {
          sendEvent("done", result);
          controller.close();
        })
        .catch((error: Error) => {
          sendEvent("error", { message: error.message });
          controller.close();
        });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
