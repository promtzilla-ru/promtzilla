import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const distDir = path.join(process.cwd(), "dist");
const files = [];
const broken = [];

const walk = async (dir) => {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full);
    } else if (entry.name.endsWith(".html")) {
      files.push(full);
    }
  }
};

const exists = async (file) => {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
};

await walk(distDir);

for (const file of files) {
  const html = await readFile(file, "utf8");
  const refs = [...html.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)].map((match) => match[1]);

  for (const ref of refs) {
    if (
      ref.startsWith("http://") ||
      ref.startsWith("https://") ||
      ref.startsWith("#") ||
      ref.startsWith("mailto:")
    ) {
      continue;
    }

    const cleanRef = ref.split("#")[0].split("?")[0];
    if (!cleanRef) continue;

    const target = cleanRef.startsWith("/")
      ? path.join(distDir, cleanRef)
      : path.resolve(path.dirname(file), cleanRef);

    if (!(await exists(target))) {
      broken.push(`${path.relative(distDir, file)} -> ${ref}`);
    }
  }
}

if (broken.length) {
  console.error("Broken local links:");
  for (const item of broken) console.error(`- ${item}`);
  process.exit(1);
}

console.log(`Checked ${files.length} HTML file(s): no broken local links.`);
