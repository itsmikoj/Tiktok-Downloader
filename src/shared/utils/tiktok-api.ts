import type { TikTokApiResponse, VideoInfoResult } from "../types/index.js";

export async function fetchVideoInfo(
  videoId: string,
): Promise<VideoInfoResult> {
  const API_ENDPOINT = "https://api16-normal-useast5.tiktokv.us/aweme/v1/feed/";
  const USER_AGENT =
    "com.zhiliaoapp.musically/300904 (2018111632; U; Android 10; en_US; Pixel 4; Build/QQ3A.200805.001; Cronet/58.0.2991.0)";

  function rand(charset: string, n: number): string {
    return Array.from(
      { length: n },
      () => charset[Math.floor(Math.random() * charset.length)] ?? "0",
    ).join("");
  }

  const params = new URLSearchParams({
    aweme_id: videoId,
    version_name: "1.1.9",
    version_code: "2018111632",
    build_number: "1.1.9",
    manifest_version_code: "2018111632",
    update_version_code: "2018111632",
    device_id: "7" + rand("0123456789", 18),
    iid: "7" + rand("0123456789", 18),
    openudid: rand("0123456789abcdef", 16),
    uuid: rand("0123456789", 16),
    _rticket: String(Date.now() * 1000),
    ts: String(Date.now()),
    device_brand: "Google",
    device_type: "Pixel 4",
    device_platform: "android",
    resolution: "1080*1920",
    dpi: "420",
    os_version: "10",
    os_api: "29",
    carrier_region: "US",
    sys_region: "US",
    region: "US",
    timezone_name: "America/New_York",
    timezone_offset: "-14400",
    channel: "googleplay",
    ac: "wifi",
    mcc_mnc: "310260",
    is_my_cn: "0",
    ssmix: "a",
    as: "a1qwert123",
    cp: "cbfhckdckkde1",
  });

  try {
    const response = await fetch(`${API_ENDPOINT}?${params}`, {
      method: "OPTIONS",
      headers: { "User-Agent": USER_AGENT },
    });

    if (!response.ok) {
      return { success: false, error: `API responded with ${response.status}` };
    }

    const json: TikTokApiResponse = await response.json();
    const item = json.aweme_list?.find((v) => v.aweme_id === videoId);

    if (!item) {
      return { success: false, error: "Video not found in API response" };
    }

    const videoUrl =
      item.video?.play_addr?.url_list?.[0] ??
      item.video?.download_addr?.url_list?.[0];

    if (!videoUrl) {
      return { success: false, error: "No download URL in response" };
    }

    const author = item.author?.unique_id || item.author?.nickname || "unknown";
    return { success: true, data: { videoUrl, author } };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
