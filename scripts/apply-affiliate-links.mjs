import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { makeAffiliateLink, slugifyTopic } from "./affiliate-link.mjs";

const root = process.cwd();
const postsDir = path.join(root, "content", "posts");
const toolsDbPath = path.join(root, "data", "ai-tools.json");

const escapeRegExp = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeName = (value = "") => value.trim().replace(/\s+/g, " ");

const toolsDb = JSON.parse(await readFile(toolsDbPath, "utf8"));
const toolsByName = new Map();
const toolsBySlug = new Map();

for (const tool of toolsDb.tools || []) {
  toolsBySlug.set(tool.slug, tool);
  toolsByName.set(normalizeName(tool.name).toLowerCase(), tool);
}

const manualAliases = [
  ["GPT Image 2", "gpt_image"],
  ["Nano Banana PRO", "nano_banana_pro"],
  ["Nano Banana Pro", "nano_banana_pro"],
  ["Nano Banana 2", "nano_banana_2"],
  ["Nano Banana", "google_image"],
  ["ChatGPT 5", "chat_gpt5"],
  ["ChatGPT Mini", "gpt_mini"],
  ["Claude Opus", "claude_opus"],
  ["Claude Sonnet", "claude_sonnet"],
  ["Claude Haiku", "claude_haiku"],
  ["Gemini", "gemini3_pro"],
  ["Midjourney", "midjourney_toe_bot"],
  ["Perplexity", "perplexity_plus_bot"],
  ["Suno", "suno"],
  ["Topaz", "topaz"],
  ["Kling", "kling_3_turbo"],
  ["Veo", "google_veo3"],
  ["Grok Image", "grok_image"],
  ["Grok", "grok_4_3"],
  ["DeepSeek", "deepseek_v4"]
];

for (const tool of toolsDb.tools || []) {
  if (tool.name && tool.slug) manualAliases.push([tool.name, tool.slug]);
}

const aliases = manualAliases
  .map(([label, slug]) => ({ label: normalizeName(label), tool: toolsBySlug.get(slug) }))
  .filter((item) => item.label && item.tool)
  .sort((a, b) => b.label.length - a.label.length);

const skipTags = new Set(["a", "pre", "code", "script", "style", "button", "h1", "h2", "h3"]);

const isSkipped = (stack) =>
  stack.some((item) => skipTags.has(item.name) || /\bpz-tag\b/.test(item.attrs) || /\bpz-card-body\b/.test(item.attrs));

const linkifyText = (text, post, usedTargets) => {
  const topicTheme = slugifyTopic(post.legacySlug || post.slug || post.title);
  const matches = [];
  const longerRanges = [];

  for (const { label } of aliases) {
    const pattern = new RegExp(`(^|[^\\p{L}\\p{N}_])(${escapeRegExp(label)})(?=$|[^\\p{L}\\p{N}_])`, "giu");
    for (const found of text.matchAll(pattern)) {
      const prefixLength = found[1].length;
      const index = found.index + prefixLength;
      longerRanges.push({ index, end: index + found[2].length, label });
    }
  }

  const isInsideLongerAlias = (index, end, label) =>
    longerRanges.some((range) => range.label.length > label.length && index >= range.index && end <= range.end);

  if (!usedTargets.has("study24-home")) {
    const homeMatch = text.match(/\b(Study AI|study24\.ai)\b/i);
    if (homeMatch?.index != null) {
      matches.push({
        index: homeMatch.index,
        end: homeMatch.index + homeMatch[0].length,
        anchor: homeMatch[0],
        key: "study24-home",
        href: makeAffiliateLink({ targetUrl: "https://study24.ai/", topicTheme })
      });
    }
  }

  for (const { label, tool } of aliases) {
    const targetKey = `tool:${tool.slug}`;
    if (usedTargets.has(targetKey)) continue;

    const pattern = new RegExp(`(^|[^\\p{L}\\p{N}_])(${escapeRegExp(label)})(?=$|[^\\p{L}\\p{N}_])`, "iu");
    const found = text.match(pattern);
    if (found?.index == null) continue;

    const prefixLength = found[1].length;
    const index = found.index + prefixLength;
    const end = index + found[2].length;
    if (isInsideLongerAlias(index, end, label)) continue;

    matches.push({
      index,
      end,
      anchor: found[2],
      key: targetKey,
      href: makeAffiliateLink({ targetUrl: tool.url, topicTheme })
    });
  }

  const selected = [];
  const usedInSegment = new Set();

  for (const match of matches.sort((a, b) => a.index - b.index || b.anchor.length - a.anchor.length)) {
    if (usedTargets.has(match.key) || usedInSegment.has(match.key)) continue;
    if (selected.some((item) => match.index < item.end && match.end > item.index)) continue;
    selected.push(match);
    usedInSegment.add(match.key);
  }

  if (!selected.length) return text;

  let output = "";
  let cursor = 0;
  for (const match of selected.sort((a, b) => a.index - b.index)) {
    output += text.slice(cursor, match.index);
    output += `<a href="${match.href}" rel="sponsored noopener" target="_blank">${match.anchor}</a>`;
    cursor = match.end;
    usedTargets.add(match.key);
  }
  output += text.slice(cursor);
  return output;
};

const linkifyHtml = (html, post) => {
  const usedTargets = new Set();
  const parts = html.split(/(<[^>]+>)/g);
  const stack = [];

  return parts
    .map((part) => {
      if (!part.startsWith("<")) {
        return isSkipped(stack) ? part : linkifyText(part, post, usedTargets);
      }

      const close = part.match(/^<\/\s*([a-z0-9-]+)/i);
      if (close) {
        const index = stack.map((item) => item.name).lastIndexOf(close[1].toLowerCase());
        if (index >= 0) stack.splice(index, 1);
        return part;
      }

      const open = part.match(/^<\s*([a-z0-9-]+)([^>]*)>/i);
      if (open && !/\/\s*>$/.test(part)) {
        stack.push({ name: open[1].toLowerCase(), attrs: open[2] || "" });
      }

      return part;
    })
    .join("");
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const writeFileWithRetry = async (filePath, content) => {
  let lastError;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      await writeFile(filePath, content, "utf8");
      return;
    } catch (error) {
      lastError = error;
      await wait(250 * (attempt + 1));
    }
  }

  throw lastError;
};

const removeExistingAffiliateLinks = (html = "") => {
  let previous = "";
  let next = html;

  while (next !== previous) {
    previous = next;
    next = next.replace(/<a\b[^>]*href="https:\/\/eduforms\.ru\/?[^"]*"[^>]*>([\s\S]*?)<\/a>/gi, "$1");
  }

  return next;
};

let changed = 0;
let scanned = 0;

for (const file of (await readdir(postsDir)).filter((item) => item.endsWith(".json"))) {
  const filePath = path.join(postsDir, file);
  const post = JSON.parse(await readFile(filePath, "utf8"));
  scanned += 1;

  if (!post.bodyHtml) continue;

  const nextBodyHtml = linkifyHtml(removeExistingAffiliateLinks(post.bodyHtml), post);
  if (nextBodyHtml === post.bodyHtml) continue;

  post.bodyHtml = nextBodyHtml;
  await writeFileWithRetry(filePath, `${JSON.stringify(post, null, 2)}\n`);
  changed += 1;
}

console.log(`Applied affiliate links to ${changed} of ${scanned} post(s).`);
