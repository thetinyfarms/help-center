import type { NarrationData, NarrationSegment, SegmentTiming } from "./types";

export async function generateNarration(
  persona: string,
  pageUrl: string,
  snapshot: string,
  refs: Record<string, { name?: string; role?: string }>
): Promise<NarrationData> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY not set — required for auto-generating narration");
  }

  const refsWithNames = Object.entries(refs)
    .filter(([, info]) => info.name && info.role)
    .map(([id, info]) => `${id}: ${info.role} "${info.name}"`)
    .join("\n");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "content-type": "application/json",
      "anthropic-version": "2023-06-01",
      "anthropic-beta": "structured-outputs-2025-11-13",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 800,
      messages: [
        {
          role: "user",
          content: `You are narrating a screen recording of a website visit. Your persona: ${persona}

You are currently viewing: ${pageUrl}

Here is the accessibility snapshot of the page:
${snapshot}

Here are the available element refs you can scroll to (only use refs from this list):
${refsWithNames}

Generate narration that flows naturally through the page from top to bottom. As you mention different parts of the page, we'll scroll to show them.

Guidelines:
- Create 3-5 segments that flow naturally as one continuous narration
- Each segment should be 1-2 sentences
- Start at the top of the page and work your way down
- For scrollTo, use "top" for the first segment, then use ref IDs (e.g. "e13", "e83", "e121") for elements you want to scroll to
- ONLY use ref IDs that appear in the list above - do not invent selectors
- Pick refs for headings, sections, or landmarks that match what you're talking about
- Keep it natural and conversational - this will be converted to speech
- Stay in character throughout`,
        },
      ],
      output_format: {
        type: "json_schema",
        schema: {
          type: "object",
          properties: {
            segments: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  text: {
                    type: "string",
                    description: "The spoken narration for this segment",
                  },
                  scrollTo: {
                    type: "string",
                    description:
                      "Element ref ID to scroll to (e.g. 'e13', 'e83') or 'top'/'bottom'. Must be from the provided refs list.",
                  },
                },
                required: ["text", "scrollTo"],
                additionalProperties: false,
              },
            },
          },
          required: ["segments"],
          additionalProperties: false,
        },
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error: ${error}`);
  }

  const data = await response.json();
  const narrationData: NarrationData = JSON.parse(data.content[0].text);
  return narrationData;
}

export function calculateSegmentTimings(
  segments: NarrationSegment[],
  charStartTimes: number[]
): SegmentTiming[] {
  const segmentTimings: SegmentTiming[] = [];
  let charOffset = 0;

  for (const segment of segments) {
    const startTime =
      charOffset < charStartTimes.length ? charStartTimes[charOffset] : 0;

    const endCharOffset = charOffset + segment.text.length;
    const endTime =
      endCharOffset < charStartTimes.length
        ? charStartTimes[endCharOffset]
        : charStartTimes[charStartTimes.length - 1];

    segmentTimings.push({
      text: segment.text,
      scrollTo: segment.scrollTo,
      startTimeSec: startTime,
      endTimeSec: endTime,
      startTimeMs: Math.round(startTime * 1000),
      endTimeMs: Math.round(endTime * 1000),
    });

    charOffset = endCharOffset + 1; // +1 for space between segments
  }

  return segmentTimings;
}
