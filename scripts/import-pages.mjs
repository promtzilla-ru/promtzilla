import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const sourceDir = path.join(root, "imports", "promtzilla-pages");
const targetDir = path.join(root, "content", "posts");

const stripTags = (html = "") => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const cleanTitle = (html = "") => stripTags(html).replace(/\s+/g, " ").trim();
const cleanSlug = (file) => file.replace(/^promtzilla-/, "").replace(/\.html$/, "");

const categoryBySlug = (slug) => {
  if (["remove-bg", "passport-final", "signature"].includes(slug)) return "Фото";
  if (["appearance", "face-shape", "kibbe", "glasses"].includes(slug)) return "Внешность";
  if (["football-card", "graduation", "birthday-childhood", "kids-drawing"].includes(slug)) return "Подарки";
  return "Промпты";
};

const legacySlugs = {
  appearance: "kak-uznat-kharakter-cheloveka-po-vneshnosti-s-pomoshhju-nejjroseti",
  "birthday-childhood": "kak-sdelat-foto-s-samim-sobojj-v-detstve-na-den-rozhdenija-s-pomoshhju-ii",
  "face-shape": "kak-opredelit-formu-lica-s-ii",
  "football-card": "kak-sdelat-kartochku-futbolista-cherez-ii",
  glasses: "kak-podobrat-ochki-s-pomoshhju-ii",
  graduation: "kak-sdelat-foto-na-vypusknojj-s-pomoshhju-nejjroseti",
  kibbe: "kak-uznat-svojj-tipazh-kibbi-po-foto-s-pomoshhju-ii",
  "kids-drawing": "kak-ozhivit-detskoe-foto-s-pomoshhju-ii",
  larson: "kak-uznat-svojj-tipazh-po-larson-s-pomoshhju-ii",
  "passport-final": "kak-sdelat-foto-na-pasport-s-pomoschyu-ii",
  "remove-bg": "kak-udalit-fon-s-foto-s-pomoshhju-ii",
  signature: "kak-uznat-kharakter-cheloveka-po-ego-podpisi-s-pomoshhju-nejjroseti"
};

const firstImage = (html) => {
  const match = html.match(/<img[^>]+src="([^"]+)"/i);
  return match?.[1] || "/images/site/promptzilla-mascot-ai-prompts-library.png";
};

const localizeUploads = (html = "") =>
  html.replaceAll("https://promtzilla.ru/wp-content/uploads/", "/wp-content/uploads/");

await mkdir(targetDir, { recursive: true });

const files = (await readdir(sourceDir)).filter((file) => file.endsWith(".html")).sort();

for (const file of files) {
  const source = await readFile(path.join(sourceDir, file), "utf8");
  const slug = cleanSlug(file);
  const title = cleanTitle(source.match(/<h2[^>]*class="pz-title"[^>]*>([\s\S]*?)<\/h2>/i)?.[1] || slug);
  const description = stripTags(source.match(/<p[^>]*class="pz-desc"[^>]*>([\s\S]*?)<\/p>/i)?.[1] || "");
  const localizedSource = localizeUploads(source);
  const bodyHtml = localizedSource.trim();
  const image = localizeUploads(firstImage(source));

  const post = {
    slug,
    legacySlug: legacySlugs[slug] || slug,
    title,
    description,
    date: "2026-07-11",
    category: categoryBySlug(slug),
    image,
    imageAlt: title,
    bodyHtml
  };

  await writeFile(path.join(targetDir, `${slug}.json`), JSON.stringify(post, null, 2), "utf8");
  console.log(`Imported ${file} -> ${slug}.json`);
}
