export interface VideoPage {
  url: string;
  narration?: string;
  highlights?: Highlight[];
  highlightDefaults?: HighlightDefaults;
}

export interface Highlight {
  onText: string;
  selector?: string;
  x?: number;
  y?: number;
  radius?: number;
  width?: number;
  height?: number;
  style?: "border" | "pulse" | "arrow" | "zoom" | "circle" | "rectangle";
  linger?: number;
}

export interface HighlightDefaults {
  style?: string;
  linger?: number;
}

export interface NarrationSegment {
  text: string;
  scrollTo: string;
}

export interface NarrationData {
  segments: NarrationSegment[];
}

export interface SegmentTiming {
  text: string;
  scrollTo: string;
  startTimeSec: number;
  endTimeSec: number;
  startTimeMs: number;
  endTimeMs: number;
}

export interface AudioResult {
  durationMs: number;
  durationSec: number;
  charStartTimes: number[];
  charEndTimes: number[];
  characters: string[];
  segmentTimings: SegmentTiming[] | null;
}

export interface ClipData extends AudioResult {
  clipNum: number;
  clipPath: string;
  segments: NarrationSegment[];
}

export interface PageData {
  url: string;
  narrationData: NarrationData;
  highlights?: Highlight[];
  highlightDefaults?: HighlightDefaults;
}

export interface VideoResult {
  success: boolean;
  playbackUrl: string;
  sessionDir: string;
  pagesRecorded: number;
}

export type ProgressEvent = {
  type: string;
  message: string;
  data?: Record<string, unknown>;
};

export type ProgressCallback = (event: ProgressEvent) => void;
