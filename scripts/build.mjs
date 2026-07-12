import { mkdir, readFile, readdir, writeFile, cp } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const contentDir = path.join(root, "content", "posts");
const publicDir = path.join(root, "public");
const distDir = path.join(root, "dist");
const aboutSlug = "o-proekte";

const site = {
  title: "ПРОМТЗИЛЛА",
  description: "Библиотека промтов на все случаи жизни!",
  url: "https://promtzilla.ru"
};

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const stripHtml = (html = "") =>
  String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .replace(/\s+([.,:;!?»])/g, "$1")
    .replace(/([«])\s+/g, "$1")
    .trim();

const markdownToHtml = (markdown = "") => {
  const blocks = markdown.trim().split(/\n{2,}/);

  return blocks
    .map((block) => {
      if (block.startsWith("## ")) {
        return `<h2>${escapeHtml(block.slice(3))}</h2>`;
      }

      if (block.startsWith("- ")) {
        const items = block
          .split("\n")
          .filter((line) => line.startsWith("- "))
          .map((line) => `<li>${escapeHtml(line.slice(2))}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }

      return `<p>${escapeHtml(block).replaceAll("\n", "<br>")}</p>`;
    })
    .join("\n");
};

const absoluteUrl = (url = "") => {
  if (/^https?:\/\//i.test(url)) return url;
  return `${site.url}${url}`;
};

const assetUrl = (url = "", basePath = ".") => {
  if (/^https?:\/\//i.test(url)) return url;
  if (!url.startsWith("/")) return url;
  return `${basePath}${url}`;
};

const localizeBodyUrls = (html = "", basePath = ".") =>
  html
    .replaceAll('src="/', `src="${basePath}/`)
    .replaceAll("src='/", `src='${basePath}/`);

const breadcrumbJsonLd = (items = []) =>
  JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  });

const organizationJsonLd = () =>
  JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.title,
    url: site.url,
    logo: absoluteUrl("/images/site/promptzilla-mascot-ai-prompts-library.png")
  });

const websiteJsonLd = () =>
  JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.title,
    url: site.url,
    description: site.description,
    publisher: {
      "@type": "Organization",
      name: site.title,
      url: site.url
    }
  });

const techArticleJsonLd = (post) =>
  JSON.stringify({
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: post.title,
    description: post.description,
    image: absoluteUrl(post.image),
    datePublished: post.date,
    dateModified: post.date,
    articleSection: post.category,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${site.url}/${postPath(post)}/`
    },
    author: {
      "@type": "Organization",
      name: site.title,
      url: site.url
    },
    publisher: {
      "@type": "Organization",
      name: site.title,
      url: site.url,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/images/site/promptzilla-mascot-ai-prompts-library.png")
      }
    }
  });

const howToJsonLd = (post) => {
  const steps = [...String(post.bodyHtml || "").matchAll(/<li[^>]*class="[^"]*\bpz-step\b[^"]*"[^>]*>[\s\S]*?<div[^>]*class="[^"]*\bpz-step-text\b[^"]*"[^>]*>([\s\S]*?)<\/div>[\s\S]*?<\/li>/gi)]
    .map((match) => stripHtml(match[1]))
    .filter(Boolean);

  if (!steps.length) return null;

  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: post.title,
    description: post.description,
    image: absoluteUrl(post.image),
    totalTime: "PT5M",
    step: steps.map((text, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: `Шаг ${index + 1}`,
      text
    }))
  });
};

const renderBreadcrumbs = (items = []) => `<nav class="breadcrumbs" aria-label="Хлебные крошки">
  <ol>
    ${items
      .map((item, index) => {
        const isLast = index === items.length - 1;
        return `<li>${isLast ? `<span aria-current="page">${escapeHtml(item.name)}</span>` : `<a href="${item.href}">${escapeHtml(item.name)}</a>`}</li>`;
      })
      .join("")}
  </ol>
</nav>`;

const siteHeader = (basePath = ".") => `<header class="site-header">
  <div class="site-header__inner">
    <a class="site-brand" href="${basePath}/index.html" aria-label="ПРОМТЗИЛЛА">
      <span class="site-brand__title">ПРОМТЗИЛЛА</span>
      <span class="site-brand__tagline">Библиотека промтов на все случаи жизни!</span>
    </a>
    <img class="site-mascot" src="${basePath}/images/site/promptzilla-mascot-ai-prompts-library.png" alt="Маскот ПРОМТЗИЛЛА за ноутбуком">
  </div>
  <nav class="site-nav" aria-label="Основная навигация">
    <a href="${basePath}/index.html">Главная</a>
    <a href="${basePath}/${aboutSlug}/">О проекте</a>
  </nav>
</header>`;

const layout = ({ title, description, image, body, basePath = ".", structuredData = [] }) => `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} | ${site.title}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:image" content="${absoluteUrl(image)}">
  <link rel="stylesheet" href="${basePath}/assets/styles.css">
  ${structuredData.map((data) => `<script type="application/ld+json">${data}</script>`).join("\n  ")}
</head>
<body>
  ${siteHeader(basePath)}
  ${body}
</body>
</html>`;

const readPosts = async () => {
  const files = (await readdir(contentDir)).filter((file) => file.endsWith(".json"));
  const posts = await Promise.all(
    files.map(async (file) => JSON.parse(await readFile(path.join(contentDir, file), "utf8")))
  );

  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
};

const postPath = (post) => post.legacySlug || post.slug;

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

const legacyAliases = {
  "kak-ozhivit-detskij-risunok-s-pomoshhju-ii": "kak-ozhivit-detskoe-foto-s-pomoshhju-ii",
  "kak-sdelat-foto-na-pasport-s-pomoshhju-nejroseti": "kak-sdelat-foto-na-pasport-s-pomoschyu-ii",
  "kak-sdelat-foto-na-vypusknoj-s-pomoshhju-ii": "kak-sdelat-foto-na-vypusknojj-s-pomoshhju-nejjroseti",
  "kak-sdelat-foto-s-soboj-v-detstve-na-dr": "kak-sdelat-foto-s-samim-sobojj-v-detstve-na-den-rozhdenija-s-pomoshhju-ii",
  "kak-sdelat-kartochku-futbolista-s-pomoshhju-ii": "kak-sdelat-kartochku-futbolista-cherez-ii",
  "kak-uznat-formu-lica-po-foto-cherez-nejroset": "kak-opredelit-formu-lica-s-ii",
  "kak-uznat-harakter-cheloveka-po-podpisi-s-pomoshhju-ii": "kak-uznat-kharakter-cheloveka-po-ego-podpisi-s-pomoshhju-nejjroseti",
  "kak-uznat-harakter-po-vneshnosti-cherez-ii": "kak-uznat-kharakter-cheloveka-po-vneshnosti-s-pomoshhju-nejjroseti",
  "kak-uznat-svoj-tipazh-po-kibbi-po-foto-s-pomoshhju-ii": "kak-uznat-svojj-tipazh-kibbi-po-foto-s-pomoshhju-ii",
  "kak-uznat-svoj-tipazh-po-larson-po-foto-s-pomoshhju-ii": "kak-uznat-svojj-tipazh-po-larson-s-pomoshhju-ii"
};

const renderRedirect = ({ title, to, basePath = "." }) => `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="robots" content="noindex">
  <meta http-equiv="refresh" content="0; url=${to}">
  <link rel="canonical" href="${absoluteUrl(to.replace(/^\.\.\//, "/"))}">
  <title>${escapeHtml(title)} | ${site.title}</title>
  <link rel="stylesheet" href="${basePath}/assets/styles.css">
</head>
<body>
  ${siteHeader(basePath)}
  <main class="article">
    <p class="lead"><a href="${to}">Открыть каноническую страницу</a></p>
  </main>
</body>
</html>`;

const renderPost = (post) => {
  const breadcrumbs = [
    { name: "Главная", href: "../index.html", url: `${site.url}/` },
    { name: breadcrumbTitle(post.title), href: "", url: `${site.url}/${postPath(post)}/` }
  ];
  const hasImportedHtml = Boolean(post.bodyHtml);
  const structuredData = [breadcrumbJsonLd(breadcrumbs), howToJsonLd(post), techArticleJsonLd(post)].filter(Boolean);

  return layout({
    title: post.title,
    description: post.description,
    image: post.image,
    basePath: "..",
    structuredData,
    body: `<main class="article">
  ${renderBreadcrumbs(breadcrumbs)}
  ${
    hasImportedHtml
      ? ""
      : `<p class="eyebrow">${escapeHtml(post.category)} · ${escapeHtml(post.date)}</p>
  <h1>${escapeHtml(post.title)}</h1>
  <p class="lead">${escapeHtml(post.description)}</p>
  <img class="cover" src="${assetUrl(post.image, "..")}" alt="${escapeHtml(post.imageAlt)}">`
  }
  <article class="content">
    ${post.bodyHtml ? localizeBodyUrls(post.bodyHtml, "..") : markdownToHtml(post.body)}
  </article>
</main>`
  });
};

const renderIndex = (posts) =>
  layout({
    title: site.title,
    description: site.description,
    image: "/images/site/promptzilla-mascot-ai-prompts-library.png",
    structuredData: [organizationJsonLd(), websiteJsonLd()],
    body: `<main class="home">
  <section class="hero">
    <p class="eyebrow">Подбери промпт для своей задачи в один клик!</p>
    <h1>ПРОМТЗИЛЛА</h1>
    <p>${site.description}</p>
  </section>
  <section class="grid">
    ${posts
      .map(
        (post) => `<a class="card" href="${postPath(post)}/index.html">
      <img src="${assetUrl(post.image)}" alt="${escapeHtml(post.imageAlt)}">
      <span>${escapeHtml(post.category)}</span>
      <h2>${escapeHtml(post.title)}</h2>
      <p>${escapeHtml(post.description)}</p>
    </a>`
      )
      .join("")}
  </section>
</main>`
  });

const renderAbout = () =>
  layout({
    title: "О проекте",
    description: "ПРОМТЗИЛЛА помогает быстро подобрать готовый промпт под конкретную задачу.",
    image: "/images/site/promptzilla-mascot-ai-prompts-library.png",
    basePath: "..",
    body: `<main class="article">
  <p class="eyebrow">О проекте</p>
  <h1>ПРОМТЗИЛЛА</h1>
  <p class="lead">ПРОМТЗИЛЛА — библиотека готовых промптов для нейросетей. Здесь можно быстро найти понятный сценарий, скопировать промпт и повторить результат без долгих экспериментов.</p>
  <article class="content">
    <p>Мы собираем практичные инструкции: что загрузить в ИИ, какой инструмент выбрать и какой текст запроса использовать. Страницы сделаны так, чтобы ты сразу переходил к делу.</p>
  </article>
</main>`
  });

await mkdir(path.join(distDir, "posts"), { recursive: true });
await cp(publicDir, distDir, { recursive: true, force: false, errorOnExist: false });
await mkdir(path.join(distDir, "assets"), { recursive: true });
await cp(path.join(publicDir, "assets", "styles.css"), path.join(distDir, "assets", "styles.css"), { force: true });

const posts = await readPosts();
await writeFile(path.join(distDir, "index.html"), renderIndex(posts), "utf8");
await mkdir(path.join(distDir, aboutSlug), { recursive: true });
await writeFile(path.join(distDir, aboutSlug, "index.html"), renderAbout(), "utf8");

for (const post of posts) {
  await writeFile(
    path.join(distDir, "posts", `${post.slug}.html`),
    renderRedirect({ title: post.title, to: `../${postPath(post)}/index.html`, basePath: ".." }),
    "utf8"
  );
  await mkdir(path.join(distDir, postPath(post)), { recursive: true });
  await writeFile(path.join(distDir, postPath(post), "index.html"), renderPost(post), "utf8");
}

for (const [from, to] of Object.entries(legacyAliases)) {
  await mkdir(path.join(distDir, from), { recursive: true });
  await writeFile(
    path.join(distDir, from, "index.html"),
    renderRedirect({ title: "Страница перемещена", to: `../${to}/index.html`, basePath: ".." }),
    "utf8"
  );
}

console.log(`Built ${posts.length} post(s) into ${distDir}`);
