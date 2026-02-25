import {
  getSavePath,
  setSavePath,
  normalizePath,
} from "../shared/utils/storage.js";
import type { Message } from "../shared/types/index.js";

type ViewId = "setup" | "settings" | "downloading";

function showView(id: ViewId): void {
  document.querySelectorAll<HTMLElement>("[data-view]").forEach((el) => {
    el.hidden = el.dataset["view"] !== id;
  });
}

function showToast(el: HTMLElement): void {
  el.classList.add("visible");
  setTimeout(() => el.classList.remove("visible"), 2000);
}

function initSettingsView(): void {
  const input = document.getElementById("path-input") as HTMLInputElement;
  const btnSave = document.getElementById("btn-save") as HTMLButtonElement;
  const btnBack = document.getElementById("btn-back") as HTMLButtonElement;
  const btnShortcut = document.getElementById(
    "btn-shortcut",
  ) as HTMLButtonElement;
  const toast = document.getElementById("toast") as HTMLElement;

  getSavePath().then((path) => {
    if (path) input.value = path;
  });

  async function save(): Promise<void> {
    const path = normalizePath(input.value);
    input.value = path;
    await setSavePath(path);
    showToast(toast);
    setTimeout(() => window.close(), 1200);
  }

  btnSave.addEventListener("click", save);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") save();
  });
  btnBack.addEventListener("click", () => showView("setup"));
  btnShortcut.addEventListener("click", () => {
    chrome.tabs.create({ url: "chrome://extensions/shortcuts" });
  });
}

async function init(): Promise<void> {
  const savePath = await getSavePath();

  if (!savePath) {
    showView("setup");
    document.getElementById("btn-setup")?.addEventListener("click", () => {
      showView("settings");
    });
    initSettingsView();
    return;
  }

  showView("downloading");
  chrome.runtime.sendMessage({ action: "download" } satisfies Message);
  setTimeout(() => window.close(), 700);
}

init();
