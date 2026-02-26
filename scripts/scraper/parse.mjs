/**
 * Daum Cafe mobile page HTML parser
 * Parses m.cafe.daum.net article pages using pure string methods and regex.
 * No external dependencies.
 */

/**
 * Extracts the text content of the first element matching the given class name.
 * @param {string} html
 * @param {string} className
 * @returns {string|null}
 */
function extractByClass(html, className) {
  const pattern = new RegExp(
    `class="${className}"[^>]*>([\\s\\S]*?)<\\/span>`,
    'i'
  );
  const match = html.match(pattern);
  if (!match) return null;
  return stripTags(match[1]).trim();
}

/**
 * Strips all HTML tags from a string.
 * @param {string} html
 * @returns {string}
 */
function stripTags(html) {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Converts a YY.MM.DD date string to YYYY-MM-DD.
 * Years < 50 are treated as 20xx, years >= 50 as 19xx.
 * @param {string} raw - e.g. "09.08.12"
 * @returns {string|null} - e.g. "2009-08-12"
 */
function convertDate(raw) {
  if (!raw) return null;
  const match = raw.trim().match(/^(\d{2})\.(\d{2})\.(\d{2})$/);
  if (!match) return null;
  const yy = parseInt(match[1], 10);
  const mm = match[2];
  const dd = match[3];
  const year = yy < 50 ? 2000 + yy : 1900 + yy;
  return `${year}-${mm}-${dd}`;
}

/**
 * Extracts the author from the txt_subject section.
 * Pattern: <span class="sr_only">작성자</span>AUTHOR<span class="txt_bar">
 * @param {string} html
 * @returns {string|null}
 */
function extractAuthor(html) {
  // Look for the pattern after "작성자" sr_only span
  const authorMatch = html.match(
    /class="sr_only"[^>]*>작성자<\/span>\s*([^<]+)/i
  );
  if (authorMatch) {
    const author = authorMatch[1].trim();
    if (author) return author;
  }
  // Fallback: look in txt_subject before first txt_bar
  const spanMatch = html.match(
    /class="txt_subject"[^>]*>([\s\S]*?)<span\s[^>]*class="txt_bar"/i
  );
  if (!spanMatch) return null;
  return stripTags(spanMatch[1]).trim() || null;
}

/**
 * Extracts the article body HTML from the tx-content-container div.
 * Uses a balanced-div approach to handle nested divs inside the article body.
 * @param {string} html
 * @returns {string|null}
 */
function extractBodyHtml(html) {
  // Find the opening tag
  const openPattern = /(<div\s[^>]*(?:id="article"|class="tx-content-container")[^>]*>)/i;
  const openMatch = html.match(openPattern);
  if (!openMatch) return null;

  const startIdx = openMatch.index + openMatch[0].length;
  // Walk through the HTML counting nested divs
  let depth = 1;
  let i = startIdx;
  while (i < html.length && depth > 0) {
    const openDiv = html.indexOf('<div', i);
    const closeDiv = html.indexOf('</div>', i);

    if (closeDiv === -1) break;

    if (openDiv !== -1 && openDiv < closeDiv) {
      depth++;
      i = openDiv + 4;
    } else {
      depth--;
      if (depth === 0) {
        return html.substring(startIdx, closeDiv);
      }
      i = closeDiv + 6;
    }
  }

  // Fallback: greedy match
  const fallback = html.substring(startIdx);
  const endIdx = fallback.indexOf('</div>');
  return endIdx !== -1 ? fallback.substring(0, endIdx) : null;
}

/**
 * Converts body HTML to plain text, preserving meaningful line breaks.
 * Replaces <br>, <BR>, </p>, </P> with newlines before stripping tags.
 * Collapses more than 2 consecutive blank lines into 2.
 * @param {string} bodyHtml
 * @returns {string}
 */
function htmlToText(bodyHtml) {
  let text = bodyHtml;
  // Replace line-break tags with newline before stripping
  text = text.replace(/<br\s*\/?>/gi, '\n');
  text = text.replace(/<\/p>/gi, '\n');
  text = text.replace(/<\/li>/gi, '\n');
  text = text.replace(/<\/div>/gi, '\n');
  text = text.replace(/<\/h[1-6]>/gi, '\n');
  // Strip all remaining tags
  text = stripTags(text);
  // Decode common HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
  // Collapse more than 2 consecutive blank lines
  text = text.replace(/(\n\s*){3,}/g, '\n\n');
  return text.trim();
}

/**
 * Extracts all YouTube URLs from the body HTML.
 * Matches youtube.com/watch, youtu.be, and youtube.com/embed patterns.
 * @param {string} bodyHtml
 * @returns {string[]}
 */
function extractYoutubeUrls(bodyHtml) {
  const urls = new Set();
  const pattern =
    /https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?[^"'\s<>]*v=[\w-]+|embed\/[\w-]+)|youtu\.be\/[\w-]+)[^"'\s<>]*/gi;
  let match;
  while ((match = pattern.exec(bodyHtml)) !== null) {
    // Clean trailing punctuation that may have been captured
    urls.add(match[0].replace(/[.,;)>\]'"]+$/, ''));
  }
  return Array.from(urls);
}

/**
 * Extracts all Daum cafe attachment links from the body HTML.
 * Looks for URLs containing t1.daumcdn.net/cafeattach/ or similar patterns.
 * @param {string} bodyHtml
 * @param {string} fullHtml - full page HTML to also search attachment sections
 * @returns {Array<{name: string, url: string}>}
 */
function extractAttachments(bodyHtml, fullHtml) {
  const results = [];
  const seen = new Set();

  // Pattern: <a href="...cafeattach...">filename</a>
  const anchorPattern =
    /<a\s[^>]*href="([^"]*(?:cafeattach|daumcdn\.net\/cafe)[^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;

  const searchIn = (source) => {
    let match;
    while ((match = anchorPattern.exec(source)) !== null) {
      const url = match[1];
      const rawName = stripTags(match[2]).trim();
      const name = rawName || url.split('/').pop() || url;
      if (!seen.has(url)) {
        seen.add(url);
        results.push({ name, url });
      }
    }
  };

  searchIn(bodyHtml);
  // Also scan the full page for attachment sections outside the article body
  searchIn(fullHtml);

  // Fallback: bare URLs in the HTML matching cafeattach pattern
  const barePattern =
    /https?:\/\/[^\s"'<>]*(?:t1\.daumcdn\.net\/cafeattach|cafefiles\.pstatic\.net)[^\s"'<>]*/gi;
  let m;
  while ((m = barePattern.exec(fullHtml)) !== null) {
    const url = m[0].replace(/[.,;)>\]'"]+$/, '');
    if (!seen.has(url)) {
      seen.add(url);
      results.push({ name: url.split('/').pop() || url, url });
    }
  }

  return results;
}

/**
 * Parses a Daum cafe mobile article page.
 * @param {string} html - Full HTML of the page
 * @returns {{ title: string, date: string|null, author: string|null, content: string, youtubeUrls: string[], attachments: Array<{name:string,url:string}> }|null}
 */
export function parseArticle(html) {
  if (isDeletedPost(html) || isNotFoundPost(html)) return null;

  // Title
  const title = extractByClass(html, 'article_title') ?? '';

  // Date - find the num_subject that looks like a date (YY.MM.DD)
  const datePattern = /class="sr_only"[^>]*>작성시간<\/span>\s*<span\s[^>]*class="num_subject"[^>]*>([^<]+)<\/span>/i;
  const dateMatch = html.match(datePattern);
  let rawDate = dateMatch ? dateMatch[1].trim() : null;
  if (!rawDate) {
    // Fallback: get first num_subject that matches date format
    const allNums = html.match(/class="num_subject"[^>]*>([^<]+)<\/span>/gi) || [];
    for (const m of allNums) {
      const val = m.match(/>([^<]+)</)?.[1]?.trim();
      if (val && /^\d{2}\.\d{2}\.\d{2}$/.test(val)) {
        rawDate = val;
        break;
      }
    }
  }
  const date = convertDate(rawDate ?? '');

  // Author
  const author = extractAuthor(html);

  // Body
  const bodyHtml = extractBodyHtml(html) ?? '';
  const content = htmlToText(bodyHtml);

  // YouTube URLs
  const youtubeUrls = extractYoutubeUrls(bodyHtml);

  // Attachments
  const attachments = extractAttachments(bodyHtml, html);

  return {
    title,
    date,
    author,
    content,
    youtubeUrls,
    attachments,
  };
}

/**
 * Returns true if the page represents a deleted post.
 * @param {string} html
 * @returns {boolean}
 */
export function isDeletedPost(html) {
  return (
    html.includes('해당 글은 삭제된 글입니다') ||
    html.includes('삭제된 게시글') ||
    html.includes('삭제된 글입니다')
  );
}

/**
 * Returns true if the page represents a not-found post (404 or explicit message).
 * @param {string} html
 * @returns {boolean}
 */
export function isNotFoundPost(html) {
  return (
    html.includes('존재하지 않는 게시글') ||
    html.includes('존재하지 않는 글') ||
    html.includes('찾을 수 없는 게시글') ||
    // HTTP 404 responses from Daum may include this text
    html.includes('404 Not Found') ||
    html.includes('페이지를 찾을 수 없습니다')
  );
}
