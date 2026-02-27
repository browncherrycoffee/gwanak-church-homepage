/**
 * 관악교회 YouTube 채널 → JSON 동기화 스크립트
 *
 * 채널: https://www.youtube.com/@gwanakchurch
 * 채널 ID: UCPdeLDiAzo38L7yAJoqknZQ
 *
 * 실행: node scripts/scraper/youtube-sync.mjs
 * 특정 카테고리만: node scripts/scraper/youtube-sync.mjs --category dawn-prayer
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = resolve(__dirname, "..", "..");
const DATA_DIR = resolve(PROJECT_ROOT, "public", "data");

const CHANNEL_ID = "UCPdeLDiAzo38L7yAJoqknZQ";
const CHANNEL_HANDLE = "@gwanakchurch";

// YouTube 내부 API (공개 키, 로그인 불필요)
const YT_API_KEY = "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8";
const YT_BROWSE_URL = `https://www.youtube.com/youtubei/v1/browse?key=${YT_API_KEY}`;
const YT_CLIENT_CONTEXT = {
  context: {
    client: {
      clientName: "WEB",
      clientVersion: "2.20231201.09.00",
      hl: "ko",
      gl: "KR",
    },
  },
};

const SLEEP_MS = 800;

// ---------------------------------------------------------------------------
// 카테고리 분류 규칙
// ---------------------------------------------------------------------------

/**
 * 영상 제목으로 카테고리를 분류한다.
 * @param {string} title
 * @param {string} description
 * @returns {string|null} category or null (skip)
 */
function classifyVideo(title, description = "") {
  const t = title.toLowerCase();

  // 주일설교: "주일" + ("설교"|"예배")
  if ((t.includes("주일") && (t.includes("설교") || t.includes("예배"))) ||
      t.includes("주일오전예배") || t.includes("주일설교")) {
    return "sunday-sermon";
  }

  // 교리문답
  if (t.includes("하이델베르크") || t.includes("하이데베르크") ||
      t.includes("웨스트민스터") || t.includes("요리문답")) {
    return "catechism";
  }

  // 아침말씀 / 새벽기도: "묵상", "새벽기도", "아침말씀"
  if (t.includes("묵상") || t.includes("새벽기도") || t.includes("아침말씀") ||
      (description && (description.includes("새벽기도") || description.includes("아침말씀")))) {
    return "dawn-prayer";
  }

  // 시편찬송: "시편" 단독 (+ 번호) — 단, 묵상이나 설교 아닌 경우
  if ((t.match(/시편\s*\d+편?/) || t.match(/psalm/i)) &&
      !t.includes("설교") && !t.includes("묵상") && !t.includes("새벽")) {
    return "psalm-song";
  }

  // 금요기도회
  if (t.includes("금요기도회") || t.includes("기도회")) {
    return "friday-prayer";
  }

  return null;
}

/**
 * 제목에서 성경 구절 추출 시도
 * e.g. "마태복음 14:1-21" → "마태복음 14:1-21"
 */
function extractScripture(title) {
  const match = title.match(
    /([가-힣a-zA-Z]+\s*\d+:\d+(?:-\d+)?(?:,\s*\d+(?::\d+(?:-\d+)?)?)*)/
  );
  return match ? match[0].trim() : "";
}

/**
 * 제목에서 설교자 추출 시도
 * e.g. "유해신 목사" or "안용준 목사"
 */
function extractPreacher(title) {
  const match = title.match(/([가-힣]{2,4})\s*목사/);
  return match ? `${match[1]} 목사` : "";
}

/**
 * ISO 날짜 문자열에서 YYYY-MM-DD 추출
 */
function toDateStr(isoStr) {
  return isoStr ? isoStr.slice(0, 10) : "";
}

// ---------------------------------------------------------------------------
// YouTube 채널 크롤러 (내부 API)
// ---------------------------------------------------------------------------

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * 채널 첫 페이지의 ytInitialData를 가져온다.
 * Returns { videos: [...], continuationToken: string|null }
 */
async function fetchChannelFirstPage() {
  const url = `https://www.youtube.com/${CHANNEL_HANDLE}/videos`;
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "ko-KR,ko;q=0.9",
    },
  });

  const html = await res.text();

  // ytInitialData 추출
  const match = html.match(/var ytInitialData\s*=\s*(\{.+?\});\s*<\/script>/s);
  if (!match) {
    throw new Error("ytInitialData not found in channel page");
  }

  let data;
  try {
    data = JSON.parse(match[1]);
  } catch (e) {
    throw new Error(`Failed to parse ytInitialData: ${e.message}`);
  }

  return parseChannelData(data);
}

/**
 * ytInitialData 혹은 browse API 응답에서 동영상 목록과 continuation token을 파싱
 */
function parseChannelData(data) {
  const videos = [];
  let continuationToken = null;

  // ytInitialData 구조 탐색
  const tabs =
    data?.contents?.twoColumnBrowseResultsRenderer?.tabs ?? [];

  let videoTab = null;
  for (const tab of tabs) {
    const t = tab?.tabRenderer;
    if (t?.title === "동영상" || t?.title === "Videos") {
      videoTab = t;
      break;
    }
    // 선택된 탭
    if (t?.selected) {
      videoTab = t;
    }
  }

  const richGridRenderer =
    videoTab?.content?.richGridRenderer ??
    videoTab?.content?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents?.[0]?.gridRenderer;

  const items = richGridRenderer?.contents ?? [];

  for (const item of items) {
    // continuation token
    if (item?.continuationItemRenderer) {
      continuationToken =
        item.continuationItemRenderer?.continuationEndpoint?.continuationCommand?.token ??
        item.continuationItemRenderer?.button?.buttonRenderer?.command?.continuationCommand?.token ??
        null;
      continue;
    }

    const videoRenderer =
      item?.richItemRenderer?.content?.videoRenderer ??
      item?.gridVideoRenderer;

    if (!videoRenderer) continue;

    const videoId = videoRenderer.videoId;
    const title =
      videoRenderer.title?.runs?.[0]?.text ??
      videoRenderer.title?.simpleText ??
      "";
    const publishedText = videoRenderer.publishedTimeText?.simpleText ?? "";
    const description =
      videoRenderer.descriptionSnippet?.runs?.map((r) => r.text).join("") ?? "";

    // thumbnails
    const thumbnails = videoRenderer.thumbnail?.thumbnails ?? [];
    const thumbnail = thumbnails[thumbnails.length - 1]?.url ?? "";

    if (videoId && title) {
      videos.push({ videoId, title, publishedText, description, thumbnail });
    }
  }

  return { videos, continuationToken };
}

/**
 * YouTube browse API로 다음 페이지를 가져온다
 */
async function fetchNextPage(continuationToken) {
  const body = {
    ...YT_CLIENT_CONTEXT,
    continuation: continuationToken,
  };

  const res = await fetch(YT_BROWSE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  // continuationContents 파싱
  const videos = [];
  let nextToken = null;

  const items =
    data?.onResponseReceivedActions?.[0]?.appendContinuationItemsAction?.continuationItems ??
    data?.onResponseReceivedActions?.[0]?.reloadContinuationItemsCommand?.continuationItems ??
    [];

  for (const item of items) {
    if (item?.continuationItemRenderer) {
      nextToken =
        item.continuationItemRenderer?.continuationEndpoint?.continuationCommand?.token ?? null;
      continue;
    }

    const videoRenderer =
      item?.richItemRenderer?.content?.videoRenderer ??
      item?.gridVideoRenderer;

    if (!videoRenderer) continue;

    const videoId = videoRenderer.videoId;
    const title =
      videoRenderer.title?.runs?.[0]?.text ??
      videoRenderer.title?.simpleText ??
      "";
    const publishedText = videoRenderer.publishedTimeText?.simpleText ?? "";
    const description =
      videoRenderer.descriptionSnippet?.runs?.map((r) => r.text).join("") ?? "";
    const thumbnails = videoRenderer.thumbnail?.thumbnails ?? [];
    const thumbnail = thumbnails[thumbnails.length - 1]?.url ?? "";

    if (videoId && title) {
      videos.push({ videoId, title, publishedText, description, thumbnail });
    }
  }

  return { videos, continuationToken: nextToken };
}

/**
 * 채널의 모든 동영상을 가져온다 (pagination 처리)
 */
async function fetchAllChannelVideos(maxPages = 200) {
  console.log(`채널 ${CHANNEL_HANDLE} 영상 목록 수집 시작...`);

  const allVideos = [];
  let page = 1;

  // 첫 페이지
  let { videos, continuationToken } = await fetchChannelFirstPage();
  allVideos.push(...videos);
  console.log(`  페이지 ${page}: ${videos.length}개 수집 (누계: ${allVideos.length})`);

  // 다음 페이지
  while (continuationToken && page < maxPages) {
    await sleep(SLEEP_MS);
    page++;

    const result = await fetchNextPage(continuationToken);
    videos = result.videos;
    continuationToken = result.continuationToken;

    allVideos.push(...videos);
    console.log(
      `  페이지 ${page}: ${videos.length}개 수집 (누계: ${allVideos.length})` +
        (continuationToken ? "" : " [마지막 페이지]")
    );

    if (videos.length === 0) break;
  }

  console.log(`총 ${allVideos.length}개 영상 수집 완료`);
  return allVideos;
}

// ---------------------------------------------------------------------------
// RSS 피드로 정확한 날짜 보완
// (YouTube 채널 페이지에는 "3일 전" 형태의 상대 시간만 표시)
// ---------------------------------------------------------------------------

/**
 * RSS 피드에서 최신 15개 영상의 정확한 날짜 + 기본 정보를 가져온다
 */
async function fetchRssVideos() {
  const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
  const res = await fetch(url);
  const xml = await res.text();

  const dateMap = new Map(); // videoId → publishedDate
  const videos = []; // { videoId, title, publishedDate }

  const entries = xml.matchAll(
    /<yt:videoId>([^<]+)<\/yt:videoId>[\s\S]*?<title>([^<]+)<\/title>[\s\S]*?<published>([^<]+)<\/published>/g
  );
  for (const m of entries) {
    const videoId = m[1];
    const title = m[2].replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");
    const publishedDate = toDateStr(m[3]);
    dateMap.set(videoId, publishedDate);
    videos.push({ videoId, title, publishedDate });
  }
  return { dateMap, videos };
}

// ---------------------------------------------------------------------------
// 날짜 추정: 상대 시간 → 절대 날짜 (fallback)
// ---------------------------------------------------------------------------

/**
 * "3일 전", "1개월 전" 같은 상대 시간에서 대략적인 날짜를 추정한다.
 * 부정확하지만 RSS에 없는 영상에 사용.
 */
function estimateDateFromRelative(relativeText, now = new Date()) {
  if (!relativeText) return "";
  const t = relativeText;

  if (t.includes("방금") || t.includes("초 전")) return toDateStr(now.toISOString());

  const minMatch = t.match(/(\d+)분 전/);
  if (minMatch) return toDateStr(now.toISOString());

  const hourMatch = t.match(/(\d+)시간 전/);
  if (hourMatch) {
    const d = new Date(now.getTime() - parseInt(hourMatch[1]) * 3600000);
    return toDateStr(d.toISOString());
  }

  const dayMatch = t.match(/(\d+)일 전/);
  if (dayMatch) {
    const d = new Date(now.getTime() - parseInt(dayMatch[1]) * 86400000);
    return toDateStr(d.toISOString());
  }

  const weekMatch = t.match(/(\d+)주 전/);
  if (weekMatch) {
    const d = new Date(now.getTime() - parseInt(weekMatch[1]) * 7 * 86400000);
    return toDateStr(d.toISOString());
  }

  const monthMatch = t.match(/(\d+)개월 전/);
  if (monthMatch) {
    const d = new Date(now);
    d.setMonth(d.getMonth() - parseInt(monthMatch[1]));
    return toDateStr(d.toISOString());
  }

  const yearMatch = t.match(/(\d+)년 전/);
  if (yearMatch) {
    const d = new Date(now);
    d.setFullYear(d.getFullYear() - parseInt(yearMatch[1]));
    return toDateStr(d.toISOString());
  }

  return "";
}

/**
 * 제목에서 날짜 추출 시도
 * e.g. "룻기 4장 묵상 2026-2-26" → "2026-02-26"
 */
function extractDateFromTitle(title) {
  // YYYY-M-D or YYYY-MM-DD
  const m1 = title.match(/(\d{4})[.\-](\d{1,2})[.\-](\d{1,2})/);
  if (m1) {
    const y = m1[1];
    const mo = m1[2].padStart(2, "0");
    const d = m1[3].padStart(2, "0");
    return `${y}-${mo}-${d}`;
  }
  // YYYY. M. D.
  const m2 = title.match(/(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})/);
  if (m2) {
    const y = m2[1];
    const mo = m2[2].padStart(2, "0");
    const d = m2[3].padStart(2, "0");
    return `${y}-${mo}-${d}`;
  }
  return "";
}

// ---------------------------------------------------------------------------
// JSON 관리
// ---------------------------------------------------------------------------

function loadJson(category) {
  const path = resolve(DATA_DIR, `${category}.json`);
  if (!existsSync(path)) return [];
  try {
    return JSON.parse(readFileSync(path, "utf-8"));
  } catch {
    return [];
  }
}

function saveJson(category, entries) {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  // 날짜 내림차순 정렬
  entries.sort((a, b) => {
    const da = a.date ? new Date(a.date).getTime() : 0;
    const db = b.date ? new Date(b.date).getTime() : 0;
    return db - da;
  });
  // 전체 파일
  const path = resolve(DATA_DIR, `${category}.json`);
  writeFileSync(path, JSON.stringify(entries, null, 2), "utf-8");
  // 슬림 인덱스 파일 (content 제거 — 목록 페이지 성능 최적화)
  const indexPath = resolve(DATA_DIR, `${category}-index.json`);
  const slim = entries.map(({ content: _c, ...rest }) => rest);
  writeFileSync(indexPath, JSON.stringify(slim), "utf-8");
}

// ---------------------------------------------------------------------------
// 메인
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const filterCategory = args.find((a) => a.startsWith("--category="))?.split("=")[1] ??
    (args.includes("--category") ? args[args.indexOf("--category") + 1] : null);

  // 1. 채널 전체 영상 수집
  const allVideos = await fetchAllChannelVideos();

  // 2. RSS에서 날짜 + 최신 비디오 목록 가져오기 (라이브 스트림 등 채널 탭 미포함 보완)
  console.log("\nRSS에서 날짜 보완 중...");
  const { dateMap: rssDateMap, videos: rssVideos } = await fetchRssVideos();

  // RSS 비디오를 allVideos 앞에 병합 (중복은 이후 단계에서 제거)
  const rssOnlyVideos = rssVideos.filter(
    (rv) => !allVideos.some((v) => v.videoId === rv.videoId)
  );
  if (rssOnlyVideos.length > 0) {
    console.log(`RSS 전용 비디오 ${rssOnlyVideos.length}개 병합 (라이브 스트림 등)`);
    for (const rv of rssOnlyVideos) {
      allVideos.unshift({ videoId: rv.videoId, title: rv.title, publishedText: "", description: "" });
    }
  }

  // 3. 기존 JSON 로드 & 존재하는 videoId Set 구성
  const categories = filterCategory
    ? [filterCategory]
    : ["sunday-sermon", "dawn-prayer", "catechism", "psalm-song", "friday-prayer"];

  const existing = {};
  const existingVideoIds = new Set();
  for (const cat of categories) {
    existing[cat] = loadJson(cat);
    for (const e of existing[cat]) {
      if (e.youtubeVideoId) existingVideoIds.add(e.youtubeVideoId);
    }
  }

  // 4. 분류 & 새 항목 생성
  const newEntries = {
    "sunday-sermon": [],
    "dawn-prayer": [],
    catechism: [],
    "psalm-song": [],
    "friday-prayer": [],
  };
  let skipped = 0;
  let duplicates = 0;
  let unclassified = 0;

  for (const video of allVideos) {
    const { videoId, title, publishedText, description } = video;

    // 중복 체크
    if (existingVideoIds.has(videoId)) {
      duplicates++;
      continue;
    }

    // 분류
    const category = classifyVideo(title, description);
    if (!category) {
      unclassified++;
      continue;
    }

    if (filterCategory && category !== filterCategory) {
      skipped++;
      continue;
    }

    // 날짜 결정
    // 새벽기도는 영상이 전날 저녁에 업로드되므로 제목 날짜(기도 날짜)를 우선 사용
    // 기타 카테고리는 RSS 업로드 날짜 우선
    const titleDate = extractDateFromTitle(title);
    const date = (category === "dawn-prayer" && titleDate)
      ? titleDate
      : rssDateMap.get(videoId) ?? titleDate ?? estimateDateFromRelative(publishedText);

    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

    const entry = {
      id: `${category}-yt-${videoId}`,
      category,
      title: title.replace(/&quot;/g, '"').replace(/&amp;/g, "&"),
      date,
      youtubeUrl,
      youtubeVideoId: videoId,
      scriptureReference: extractScripture(title),
      content: description || "",
      preacher: extractPreacher(title),
      createdAt: date ? new Date(date).toISOString() : new Date().toISOString(),
      updatedAt: date ? new Date(date).toISOString() : new Date().toISOString(),
      sourceBoard: "youtube",
      sourcePostId: 0,
      attachments: [],
    };

    newEntries[category].push(entry);
    existingVideoIds.add(videoId);
  }

  // 5. 저장
  console.log("\n=== 결과 ===");
  let totalNew = 0;
  for (const cat of categories) {
    const added = newEntries[cat];
    if (added.length > 0) {
      const merged = [...existing[cat], ...added];
      saveJson(cat, merged);
      console.log(
        `  [${cat}] ${added.length}개 추가 → 총 ${merged.length}개`
      );
      totalNew += added.length;
    } else {
      console.log(`  [${cat}] 새 항목 없음 (${existing[cat].length}개 유지)`);
    }
  }

  console.log(`\n중복 제외: ${duplicates}개`);
  console.log(`분류 불가: ${unclassified}개`);
  if (skipped > 0) console.log(`카테고리 필터로 건너뜀: ${skipped}개`);
  console.log(`총 ${totalNew}개 새 항목 추가 완료`);
}

main().catch((err) => {
  console.error("오류:", err);
  process.exit(1);
});
