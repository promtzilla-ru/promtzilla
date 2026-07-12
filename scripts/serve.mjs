import { createReadStream, existsSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";

const distDir = path.join(process.cwd(), "dist");
const port = Number(process.env.PORT || 4173);

const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp"
};

createServer((req, res) => {
  const cleanUrl = decodeURIComponent(req.url.split("?")[0]);
  const filePath = path.join(distDir, cleanUrl === "/" ? "index.html" : cleanUrl);
  const resolved = existsSync(filePath) ? filePath : path.join(distDir, "index.html");
  const ext = path.extname(resolved);

  res.setHeader("Content-Type", types[ext] || "application/octet-stream");
  createReadStream(resolved).pipe(res);
}).listen(port, () => {
  console.log(`Promptzilla preview: http://localhost:${port}`);
});
