import type { Settings } from "../types/index.js";

const SAVE_PATH_KEY: keyof Settings = "savePath";

export async function getSavePath(): Promise<string | null> {
  const result = await chrome.storage.local.get(SAVE_PATH_KEY);
  return (result[SAVE_PATH_KEY] as string | undefined) ?? null;
}

export async function setSavePath(path: string): Promise<void> {
  await chrome.storage.local.set({ [SAVE_PATH_KEY]: path });
}

export function normalizePath(raw: string): string {
  return raw.replace(/^[/\\]+|[/\\]+$/g, "").trim() || "TikTok";
}
