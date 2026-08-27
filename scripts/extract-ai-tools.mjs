import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const [, , sourceArg, outputArg = "data/ai-tools.json"] = process.argv;

if (!sourceArg) {
  console.error("Usage: node scripts/extract-ai-tools.mjs <html-file> [output-json]");
  process.exit(1);
}

const sourcePath = path.resolve(sourceArg);
const outputPath = path.resolve(outputArg);
const raw = await readFile(sourcePath, "utf8");

const decodePayload = (value) =>
  value
    .replaceAll("\\u003c", "<")
    .replaceAll("\\u003e", ">")
    .replaceAll("\\u0026", "&")
    .replaceAll('\\"', '"')
    .replaceAll("\\/", "/");

const stripHtml = (value = "") =>
  value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const decodeEntities = (value = "") =>
  value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");

const slugToName = (slug = "") =>
  slug
    .split(/[-_]/)
    .map((part) => {
      if (["gpt", "ai", "api"].includes(part)) return part.toUpperCase();
      if (["o1", "o3", "o4"].includes(part)) return part;
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(" ");

const text = decodePayload(raw);
const tools = new Map();

const upsert = (slug, patch = {}) => {
  if (!slug || ["bots", "chat"].includes(slug)) return;
  const current = tools.get(slug) || {
    slug,
    name: slugToName(slug),
    url: `https://study24.ai/chat/${slug}`,
    description: "",
    tokenCost: null,
    rating: null,
    usageCount: null,
    image: "",
    categories: [],
    source: "study24.ai/bots"
  };

  tools.set(slug, {
    ...current,
    ...patch,
    categories: [...new Set([...(current.categories || []), ...(patch.categories || [])].filter(Boolean))]
  });
};

for (const match of text.matchAll(/<a[^>]+href="\/chat\/([^"?#/]+)"[^>]*>([\s\S]*?)<\/article><\/a>/g)) {
  const slug = match[1];
  const html = match[2];
  const name = decodeEntities(stripHtml(html.match(/<h3[^>]*>([\s\S]*?)<\/h3>/)?.[1] || ""));
  const description = decodeEntities(stripHtml(html.match(/<p[^>]*>([\s\S]*?)<\/p>/)?.[1] || ""));
  const image = decodeEntities(html.match(/<img[^>]+src="([^"]+)"/)?.[1] || "");
  const tokenCost = Number(stripHtml(html.match(/<span[^>]*class="[^"]*GXpJQp[^"]*"[^>]*>([\s\S]*?)<\/span>/)?.[1] || "")) || null;
  const stats = [...html.matchAll(/<span[^>]*class="[^"]*MZxWnt[^"]*"[^>]*>([\s\S]*?)<\/span>/g)].map((item) =>
    decodeEntities(stripHtml(item[1])).replace(/\s+/g, " ")
  );
  const rating = stats[0] ? Number(stats[0].replace(",", ".")) : null;
  const usageCount = stats[1] ? Number(stats[1].replace(/\D/g, "")) || null : null;
  upsert(slug, { name: name || slugToName(slug), description, tokenCost, rating, usageCount, image });
}

const knownCategories = [
  "Текст",
  "Изображения",
  "Видео",
  "Музыка",
  "Аудио",
  "Учёба",
  "Работа",
  "Код",
  "Презентации",
  "Маркетинг",
  "Поиск",
  "Фото"
];

for (const tool of tools.values()) {
  const needle = tool.slug.replace(/-/g, "[\\s-]");
  const around = text.match(new RegExp(`.{0,500}${needle}.{0,900}`, "i"))?.[0] || "";
  for (const category of knownCategories) {
    if (around.includes(category)) tool.categories.push(category);
  }
  tool.categories = [...new Set(tool.categories)];
}

const sorted = [...tools.values()].sort((a, b) => a.name.localeCompare(b.name, "ru"));

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(
  outputPath,
  `${JSON.stringify(
    {
      updatedAt: new Date().toISOString(),
      sourceFile: sourcePath,
      total: sorted.length,
      tools: sorted
    },
    null,
    2
  )}\n`,
  "utf8"
);

console.log(`Extracted ${sorted.length} tools to ${outputPath}`);
