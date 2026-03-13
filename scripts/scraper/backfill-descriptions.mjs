/**
 * content 필드 정리 스크립트
 *
 * YouTube-only 항목에서 "http://gwanakchurch.org/" 같은
 * URL만 있는 무의미한 content를 빈 문자열로 정리한다.
 *
 * 실행: node scripts/scraper/backfill-descriptions.mjs
 * 특정 카테고리: node scripts/scraper/backfill-descriptions.mjs --category sunday-sermon
 * 테스트: node scripts/scraper/backfill-descriptions.mjs --dry-run
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = resolve(__dirname, "..", "..");
const DATA_DIR = resolve(PROJECT_ROOT, "public", "data");

function isUrlOnly(content) {
  return /^https?:\/\/\S+$/.test(content.trim());
}

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
  entries.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  const fullPath = resolve(DATA_DIR, `${category}.json`);
  writeFileSync(fullPath, JSON.stringify(entries, null, 2), "utf-8");
  const indexPath = resolve(DATA_DIR, `${category}-index.json`);
  const slim = entries.map(({ content: _c, ...rest }) => rest);
  writeFileSync(indexPath, JSON.stringify(slim), "utf-8");
}

async function main() {
  const args = process.argv.slice(2);
  const filterCategory =
    args.find((a) => a.startsWith("--category="))?.split("=")[1] ??
    (args.includes("--category") ? args[args.indexOf("--category") + 1] : null);
  const dryRun = args.includes("--dry-run");
  if (dryRun) console.log("[DRY RUN] 파일 저장 안 함\n");

  const categories = filterCategory
    ? [filterCategory]
    : ["sunday-sermon", "friday-prayer", "catechism", "dawn-prayer", "psalm-song"];

  for (const cat of categories) {
    const entries = loadJson(cat);
    const targets = entries.filter((e) => e.content && isUrlOnly(e.content));
    console.log(`[${cat}] 전체 ${entries.length}개 | URL-only 정리 대상: ${targets.length}개`);
    if (targets.length > 0 && !dryRun) {
      for (const e of targets) e.content = "";
      saveJson(cat, entries);
      console.log(`  → ${targets.length}개 정리 완료`);
    } else if (targets.length > 0 && dryRun) {
      targets.slice(0, 3).forEach((e) => console.log("  sample:", e.id, JSON.stringify(e.content)));
    }
  }
  console.log("\n완료");
}

main().catch((e) => {
  console.error("오류:", e);
  process.exit(1);
});
