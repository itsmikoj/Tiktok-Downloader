export type MessageAction = "download" | "openSettings" | "settingsSaved";

export interface Message {
  action: MessageAction;
  tabId?: number;
}
