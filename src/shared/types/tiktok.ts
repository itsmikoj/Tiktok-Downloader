export interface TikTokApiResponse {
  status_code: number;
  aweme_list: TikTokAweme[];
}

export interface TikTokAweme {
  aweme_id: string;
  author: TikTokAuthor;
  video: TikTokVideo;
}

export interface TikTokAuthor {
  uid: string;
  unique_id: string;
  nickname: string;
}

export interface TikTokVideo {
  play_addr: TikTokUrlList;
  download_addr: TikTokUrlList;
}

export interface TikTokUrlList {
  url_list: string[];
}

// ─── Result types ─────────────────────────────────────────────────────────────

export interface VideoInfo {
  videoUrl: string;
  author: string;
}

export type VideoInfoResult =
  | { success: true; data: VideoInfo }
  | { success: false; error: string };
