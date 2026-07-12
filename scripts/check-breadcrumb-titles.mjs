import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const dir = path.join(process.cwd(), "content", "posts");
const failures = [];

const breadcrumbTitle = (title = "") => {
  let value = title;

  if (/с помощью/i.test(value)) {
    value = value.replace(/с помощью/gi, "через");
  } else if (/через/i.test(value)) {
    value = value.replace(/через/gi, "с помощью");
  }

  if (/нейросет/i.test(value)) {
    value = value.replace(/нейросети/gi, "ИИ").replace(/нейросеть/gi, "ИИ");
  } else if (/\bИИ\b/i.test(value)) {
    value = value.replace(/\bИИ\b/gi, "нейросети");
  }

  return value === title ? `${title}: промпт` : value;
};

for (const file of (await readdir(dir)).filter((name) => name.endsWith(".json"))) {
  const post = JSON.parse(await readFile(path.join(dir, file), "utf8"));
  const crumb = breadcrumbTitle(post.title);

  if (crumb === post.title) {
    failures.push(`${post.slug}: breadcrumb equals title`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Breadcrumb titles differ from page titles.");
