import { execSync } from "child_process";

const AGENT_BROWSER_BIN = "agent-browser";

export function agentBrowser(
  command: string,
  options: { timeout?: number } = {}
): string {
  const fullCommand = `${AGENT_BROWSER_BIN} ${command}`;
  console.error(`[video] $ ${fullCommand}`);
  try {
    const result = execSync(fullCommand, {
      encoding: "utf-8",
      timeout: options.timeout || 30000,
      stdio: ["pipe", "pipe", "pipe"],
    });
    return result.trim();
  } catch (error: unknown) {
    const err = error as Error & { stderr?: string };
    console.error(`[video] Command failed: ${err.message}`);
    if (err.stderr) console.error(`[video] stderr: ${err.stderr}`);
    throw error;
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
