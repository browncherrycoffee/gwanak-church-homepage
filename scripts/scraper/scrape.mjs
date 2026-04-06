import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArticle, isDeletedPost, isNotFoundPost } from "./parse.mjs";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const CAFE_CODE = "-goodchurch";
const BASE_URL = `https://m.cafe.daum.net/${CAFE_CODE}`;
const FETCH_DELAY = 600; // ms between requests
const MAX_CONSECUTIVE_FAILS = 80; // stop after this many consecutive 404/deleted
const FLUSH_INTERVAL = 50; // save to disk every N posts
const USER_AGENT =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1";

const BOARDS = {
  GZ99: { name: "교회소개", category: "notices" },
  IAd7: { name: "예배와 모임", category: "notices" },
  I5uP: { name: "하이델베르크요리문답", category: "catechism" },
  ROHB: { name: "시편찬송", category: "psalm-song" },
  RMqC: { name: "주일예배 설교", category: "sunday-sermon" },
  IYIi: { name: "주일예배준비(주보)", category: "bulletin" },
  RNUE: { name: "아침말씀", category: "dawn-prayer" },
  RXZr: { name: "매일말씀묵상-요한복음", category: "dawn-prayer" },
  RXfF: { name: "매일말씀묵상-사무엘상", category: "dawn-prayer" },
};

// ---------------------------------------------------------------------------
// Path helpers
// ---------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROJECT_ROOT = resolve(__dirname, "..", "..");
const PROGRESS_FILE = resolve(__dirname, "progress.json");
const DATA_DIR = resolve(PROJECT_ROOT, "public", "data");

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractVideoId(url) {
  if (!url) return "";
  // Standard watch URL: https://www.youtube.com/watch?v=XXXXXXXXXXX
  const watchMatch = url.match(/[?&]v=([A-Za-z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];
  // Short URL: https://youtu.be/XXXXXXXXXXX
  const shortMatch = url.match(/youtu\.be\/([A-Za-z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];
  // Embed URL: https://www.youtube.com/embed/XXXXXXXXXXX
  const embedMatch = url.match(/youtube\.com\/embed\/([A-Za-z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];
  return "";
}

// ---------------------------------------------------------------------------
// Network
// ---------------------------------------------------------------------------

async function fetchPage(boardCode, postNumber) {
  const url = `${BASE_URL}/${boardCode}/${postNumber}`;
  const MAX_RETRIES = 3;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": USER_AGENT,
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8",
        },
      });

      if (response.status === 404) {
        return null;
      }

      if (response.status >= 500) {
        if (attempt < MAX_RETRIES) {
          console.error(
            `  [${boardCode}] #${postNumber} - HTTP ${response.status}, retrying (${attempt}/${MAX_RETRIES})...`
          );
          await sleep(2000);
          continue;
        }
        console.error(
          `  [${boardCode}] #${postNumber} - HTTP ${response.status} after ${MAX_RETRIES} attempts`
        );
        return null;
      }

      return await response.text();
    } catch (err) {
      if (attempt < MAX_RETRIES) {
        console.error(
          `  [${boardCode}] #${postNumber} - Network error: ${err.message}, retrying (${attempt}/${MAX_RETRIES})...`
        );
        await sleep(2000);
        continue;
      }
      console.error(
        `  [${boardCode}] #${postNumber} - Network error after ${MAX_RETRIES} attempts: ${err.message}`
      );
      return null;
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// Progress persistence
// ---------------------------------------------------------------------------

function loadProgress() {
  if (!existsSync(PROGRESS_FILE)) {
    return {};
  }
  try {
    const raw = readFileSync(PROGRESS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to load progress.json: ${err.message}`);
    return {};
  }
}

function saveProgress(progress) {
  try {
    writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2), "utf-8");
  } catch (err) {
    console.error(`Failed to save progress.json: ${err.message}`);
  }
}

// ---------------------------------------------------------------------------
// Results persistence
// ---------------------------------------------------------------------------

function getDataFilePath(boardCode) {
  const board = BOARDS[boardCode];
  if (!board) throw new Error(`Unknown board code: ${boardCode}`);
  return resolve(DATA_DIR, `${board.category}.json`);
}

function loadResults(boardCode) {
  const filePath = getDataFilePath(boardCode);
  if (!existsSync(filePath)) {
    return [];
  }
  try {
    const raw = readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to load ${filePath}: ${err.message}`);
    return [];
  }
}

function saveResults(boardCode, entries) {
  const board = BOARDS[boardCode];
  if (!board) throw new Error(`Unknown board code: ${boardCode}`);

  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }

  const filePath = getDataFilePath(boardCode);
  try {
    writeFileSync(filePath, JSON.stringify(entries, null, 2), "utf-8");
    // 슬림 인덱스 파일 자동 생성 (content 제거 — 목록/홈 성능 최적화)
    const indexPath = resolve(DATA_DIR, `${board.category}-index.json`);
    const slim = entries.map(({ content: _c, ...rest }) => rest);
    writeFileSync(indexPath, JSON.stringify(slim), "utf-8");
  } catch (err) {
    console.error(`Failed to save ${filePath}: ${err.message}`);
  }
}

// ---------------------------------------------------------------------------
// Entry builder
// ---------------------------------------------------------------------------

function buildEntry(boardCode, postNumber, parsed) {
  const board = BOARDS[boardCode];
  const category = board.category;

  return {
    id: `${category}-cafe-${boardCode}-${postNumber}`,
    category,
    title: parsed.title,
    date: parsed.date,
    youtubeUrl: parsed.youtubeUrls?.[0] || "",
    youtubeVideoId: extractVideoId(parsed.youtubeUrls?.[0] || ""),
    scriptureReference: "",
    content: parsed.content,
    preacher: parsed.author || "",
    createdAt: parsed.date ? new Date(parsed.date).toISOString() : new Date().toISOString(),
    updatedAt: parsed.date ? new Date(parsed.date).toISOString() : new Date().toISOString(),
    sourceBoard: boardCode,
    sourcePostId: postNumber,
    attachments: parsed.attachments || [],
  };
}

// ---------------------------------------------------------------------------
// Board scraper
// ---------------------------------------------------------------------------

async function scrapeBoard(boardCode, globalProgress) {
  const board = BOARDS[boardCode];
  if (!board) {
    console.error(`Unknown board: ${boardCode}`);
    return;
  }

  console.log(`\n=== Scraping [${boardCode}] ${board.name} (${board.category}) ===`);

  const boardProgress = globalProgress[boardCode] || { lastPost: 0, totalFound: 0 };
  const startPost = (boardProgress.lastPost || 0) + 1;

  console.log(`  Resuming from post #${startPost} (${boardProgress.totalFound || 0} already found)`);

  // Load existing results (for merge)
  let existingEntries = loadResults(boardCode);
  let existingIds = new Set(existingEntries.map((e) => e.id));

  let newEntries = [];
  let consecutiveFails = 0;
  let totalFound = boardProgress.totalFound || 0;
  let postNumber = startPost;
  let processedSinceFlush = 0;

  while (consecutiveFails < MAX_CONSECUTIVE_FAILS) {
    await sleep(FETCH_DELAY);

    const html = await fetchPage(boardCode, postNumber);

    if (html === null) {
      // HTTP 404 or persistent network failure
      consecutiveFails++;
      if (consecutiveFails % 5 === 0) {
        console.log(
          `  [${boardCode}] #${postNumber} - 404/null (${consecutiveFails}/${MAX_CONSECUTIVE_FAILS} consecutive fails)`
        );
      }
      postNumber++;
      processedSinceFlush++;
    } else if (isNotFoundPost(html)) {
      consecutiveFails++;
      if (consecutiveFails % 5 === 0) {
        console.log(
          `  [${boardCode}] #${postNumber} - Not found (${consecutiveFails}/${MAX_CONSECUTIVE_FAILS} consecutive fails)`
        );
      }
      postNumber++;
      processedSinceFlush++;
    } else if (isDeletedPost(html)) {
      consecutiveFails++;
      if (consecutiveFails % 5 === 0) {
        console.log(
          `  [${boardCode}] #${postNumber} - Deleted (${consecutiveFails}/${MAX_CONSECUTIVE_FAILS} consecutive fails)`
        );
      }
      postNumber++;
      processedSinceFlush++;
    } else {
      // Valid post
      consecutiveFails = 0;

      try {
        const parsed = parseArticle(html);
        const entryId = `${board.category}-cafe-${boardCode}-${postNumber}`;

        if (!existingIds.has(entryId)) {
            const entry = buildEntry(boardCode, postNumber, parsed);
            newEntries.push(entry);
            existingIds.add(entryId);
            totalFound++;
          }

          console.log(
            `  [${boardCode}] #${postNumber} - "${parsed.title}" (${totalFound} found)`
          );
      } catch (err) {
        console.error(
          `  [${boardCode}] #${postNumber} - Parse error: ${err.message}`
        );
      }

      postNumber++;
      processedSinceFlush++;
    }

    // Update progress tracker regardless
    globalProgress[boardCode] = {
      lastPost: postNumber - 1,
      totalFound,
    };

    // Flush every FLUSH_INTERVAL processed posts
    if (processedSinceFlush >= FLUSH_INTERVAL) {
      processedSinceFlush = 0;

      if (newEntries.length > 0) {
        const merged = mergeEntries(existingEntries, newEntries);
        saveResults(boardCode, merged);
        existingEntries = merged;
        newEntries = [];
        console.log(
          `  [${boardCode}] Flushed - ${totalFound} total entries saved`
        );
      }

      saveProgress(globalProgress);
    }
  }

  // Final flush
  if (newEntries.length > 0) {
    const merged = mergeEntries(existingEntries, newEntries);
    saveResults(boardCode, merged);
    console.log(
      `  [${boardCode}] Final save - ${totalFound} total entries`
    );
  }

  globalProgress[boardCode] = {
    lastPost: postNumber - 1,
    totalFound,
  };
  saveProgress(globalProgress);

  console.log(
    `  [${boardCode}] Done. Stopped at post #${postNumber - 1} after ${MAX_CONSECUTIVE_FAILS} consecutive fails. Total: ${totalFound}`
  );

  return totalFound;
}

// ---------------------------------------------------------------------------
// Merge helpers
// ---------------------------------------------------------------------------

function mergeEntries(existing, incoming) {
  const idSet = new Set(existing.map((e) => e.id));
  const toAdd = incoming.filter((e) => !idSet.has(e.id));
  // Sort by date descending (newest first)
  const merged = [...existing, ...toAdd];
  merged.sort((a, b) => {
    const da = a.date ? new Date(a.date).getTime() : 0;
    const db = b.date ? new Date(b.date).getTime() : 0;
    return db - da;
  });
  return merged;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);

  let boardsToScrape;
  if (args.length > 0) {
    // 여러 게시판 코드를 인자로 받을 수 있음: node scrape.mjs IYIi IAd7 GZ99
    const invalid = args.filter((a) => !BOARDS[a]);
    if (invalid.length > 0) {
      console.error(`Unknown board code(s): ${invalid.join(", ")}`);
      console.error(`Available: ${Object.keys(BOARDS).join(", ")}`);
      process.exit(1);
    }
    boardsToScrape = args;
  } else {
    // Default order
    boardsToScrape = ["GZ99", "IAd7", "I5uP", "ROHB", "RMqC", "IYIi", "RNUE", "RXZr", "RXfF"];
  }

  const globalProgress = loadProgress();

  // Handle graceful SIGINT
  let interrupted = false;
  process.on("SIGINT", () => {
    if (!interrupted) {
      interrupted = true;
      console.log("\n\nInterrupted. Saving progress...");
      saveProgress(globalProgress);
      console.log("Progress saved. Exiting.");
      process.exit(0);
    }
  });

  console.log(`Starting scraper for boards: ${boardsToScrape.join(", ")}`);
  console.log(`Progress file: ${PROGRESS_FILE}`);
  console.log(`Data directory: ${DATA_DIR}`);

  const summary = {};

  for (const boardCode of boardsToScrape) {
    if (interrupted) break;
    const count = await scrapeBoard(boardCode, globalProgress);
    summary[boardCode] = { name: BOARDS[boardCode].name, total: count };
  }

  console.log("\n=== Scrape Summary ===");
  for (const [code, info] of Object.entries(summary)) {
    console.log(`  [${code}] ${info.name}: ${info.total} entries`);
  }
  console.log("Done.");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
