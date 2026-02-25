import {
  getSavePath,
  setSavePath,
  normalizePath,
} from "../shared/utils/storage.js";
import type { Message } from "../shared/types/index.js";

function showToast(el: HTMLElement): void {
  el.classList.add("visible");
  setTimeout(() => el.classList.remove("visible"), 2500);
}

async function init(): Promise<void> {
  const input = document.getElementById("path-input") as HTMLInputElement;
  const btnSave = document.getElementById("btn-save") as HTMLButtonElement;
  const btnShortcut = document.getElementById(
    "btn-shortcut",
  ) as HTMLButtonElement;
  const toast = document.getElementById("toast") as HTMLElement;

  const current = await getSavePath();
  if (current) input.value = current;

  async function save(): Promise<void> {
    const path = normalizePath(input.value);
    input.value = path;
    await setSavePath(path);
    chrome.runtime.sendMessage({ action: "settingsSaved" } satisfies Message);
    showToast(toast);
  }

  btnSave.addEventListener("click", save);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") save();
  });
  btnShortcut.addEventListener("click", () => {
    chrome.tabs.create({ url: "chrome://extensions/shortcuts" });
  });
}

init();
