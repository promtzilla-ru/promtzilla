import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const dir = path.join(process.cwd(), "content", "posts");
const strip = (html = "") => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const matches = (html, pattern) => [...html.matchAll(pattern)].map((match) => strip(match[1] || match[0]));

for (const file of (await readdir(dir)).filter((name) => name.endsWith(".json")).sort()) {
  const post = JSON.parse(await readFile(path.join(dir, file), "utf8"));
  const html = post.bodyHtml || "";
  const sections = matches(html, /<div class="pz-section-label">([\s\S]*?)<\/div>/g);
  const cards = matches(html, /<span class="pz-card-meta">([\s\S]*?)<\/span>/g);
  const tools = matches(html, /<div class="pz-tool-name">([\s\S]*?)<\/div>/g);
  const tags = matches(html, /<span class="pz-tag">([\s\S]*?)<\/span>/g);
  const visualTypes = [
    html.includes("pz-photo-stack") && "photo-stack",
    html.includes("pz-source-photos") && "source-photos",
    html.includes("pz-ba") && "before-after",
    html.includes("pz-result") && "result",
    html.includes("pz-video-wrap") && "video",
    html.includes("pz-tabs") && "tabs",
    html.includes("pz-tool") && "tool-blocks"
  ].filter(Boolean);

  console.log(`\n${post.slug}`);
  console.log(`title: ${post.title}`);
  console.log(`url: /${post.legacySlug || post.slug}/`);
  console.log(`description: ${post.description}`);
  console.log(`visuals: ${visualTypes.join(", ") || "none"}`);
  console.log(`tools: ${[...new Set(tools)].join(", ") || "from card meta"}`);
  console.log(`sections: ${sections.join(" | ")}`);
  console.log(`prompt cards: ${cards.length} (${cards.join(" | ")})`);
  console.log(`tags: ${tags.slice(0, 10).join(", ")}`);
}
