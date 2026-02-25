import { fetchVideoInfo } from "./shared/utils/tiktok-api.js";
import { buildDownloadPath, extractVideoId } from "./shared/utils/filename.js";
import { getSavePath } from "./shared/utils/storage.js";
import type { Message, VideoInfoResult } from "./shared/types/index.js";

const CONTEXT_MENU_ID = "open-settings";

async function downloadVideo(tabId: number, tabUrl: string): Promise<void> {
  const savePath = await getSavePath();
  if (!savePath) return;

  const videoId = extractVideoId(tabUrl);
  if (!videoId) return;

  const [injected] = await chrome.scripting.executeScript({
    target: { tabId },
    func: fetchVideoInfo as (...args: unknown[]) => unknown,
    args: [videoId],
  });

  const result = injected?.result as VideoInfoResult | undefined;
  if (!result?.success) {
    console.error("[TikTok DL]", result ? result.error : "No result");
    return;
  }

  const { videoUrl, author } = result.data;

  await chrome.downloads.download({
    url: videoUrl,
    filename: buildDownloadPath(savePath, author, videoId),
    saveAs: false,
    conflictAction: "uniquify",
  });
}

async function downloadActiveTab(): Promise<void> {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  if (tab?.id && tab.url) downloadVideo(tab.id, tab.url);
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: "⚙️ Configurar TikTok Downloader",
    contexts: ["action"],
  });
});

chrome.contextMenus.onClicked.addListener(({ menuItemId }) => {
  if (menuItemId === CONTEXT_MENU_ID) chrome.action.openPopup();
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "download-video") return;
  downloadActiveTab();
});

chrome.runtime.onMessage.addListener((raw: unknown, _sender, sendResponse) => {
  const msg = raw as Message;

  if (msg.action === "download") {
    if (msg.tabId) {
      chrome.tabs.get(msg.tabId).then((tab) => {
        if (tab.id && tab.url) downloadVideo(tab.id, tab.url);
      });
    } else {
      downloadActiveTab();
    }
  }

  sendResponse({ ok: true });
  return true;
});

function updateActionState(tab: chrome.tabs.Tab): void {
  const isTikTok =
    tab.url?.includes("tiktok.com/") && tab.url?.includes("/video/");
  if (isTikTok) {
    chrome.action.enable(tab.id);
  } else {
    chrome.action.disable(tab.id);
  }
}

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  const tab = await chrome.tabs.get(tabId);
  updateActionState(tab);
});

chrome.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
  if (changeInfo.url) updateActionState(tab);
});
