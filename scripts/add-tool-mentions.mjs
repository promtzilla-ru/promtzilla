import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const postsDir = path.join(root, "content", "posts");

const mentions = {
  "firmennyj-blank.json": "Для такой задачи лучше всего подойдут GPT Image 2, Nano Banana PRO или Qwen Image 3: эти модели умеют собирать макеты с русским текстом и аккуратной композицией.",
  "kartochka-tovara-marketplejs.json": "Для карточки товара лучше всего подойдут GPT Image 2, Nano Banana PRO или Qwen Image 3: они работают с предметными фото, крупным текстом и рекламной композицией.",
  "kot-v-cheloveka.json": "Для такого фотоэффекта лучше всего подойдут GPT Image 2 или Nano Banana PRO: они умеют сохранять черты исходного фото и превращать их в новый реалистичный образ.",
  "meshki-pod-glazami.json": "Для аккуратной ретуши лица лучше всего подойдут GPT Image 2 или Nano Banana PRO: они редактируют конкретную зону и помогают сохранить естественную кожу.",
  "poster-analiz-vneshnosti.json": "Для постера с анализом внешности лучше всего подойдут GPT Image 2 или Nano Banana PRO: они могут совместить портрет, инфографику и русские подписи.",
  "primerit-borodu-na-foto.json": "Для примерки бороды лучше всего подойдут GPT Image 2 или Nano Banana PRO: они умеют менять детали внешности и сохранять лицо узнаваемым.",
  "primerit-usy-na-foto.json": "Для примерки усов лучше всего подойдут GPT Image 2 или Nano Banana PRO: они аккуратно добавляют детали внешности без грубой деформации лица.",
  "sdelat-skuly-na-foto.json": "Для мягкой коррекции скул лучше всего подойдут GPT Image 2 или Nano Banana PRO: они позволяют менять форму лица деликатно и без эффекта пластики.",
  "ubrat-borodu-s-foto.json": "Для удаления бороды лучше всего подойдут GPT Image 2 или Nano Banana PRO: они помогают очистить нижнюю часть лица и сохранить естественные черты.",
  "ubrat-morshchiny-na-foto.json": "Для ретуши морщин лучше всего подойдут GPT Image 2 или Nano Banana PRO: они умеют смягчать кожу без кукольного размытия.",
  "ubrat-rodinku-na-foto.json": "Для удаления родинки лучше всего подойдут GPT Image 2 или Nano Banana PRO: они редактируют маленькие детали и сохраняют текстуру кожи.",
  "ubrat-shram-na-foto.json": "Для удаления шрама лучше всего подойдут GPT Image 2 или Nano Banana PRO: они могут восстановить участок кожи и не менять всё лицо.",
  "ubrat-usy-s-foto.json": "Для удаления усов лучше всего подойдут GPT Image 2 или Nano Banana PRO: они аккуратно очищают область над губой и сохраняют естественную кожу.",
  "ubrat-vtoroj-podborodok-s-foto.json": "Для коррекции второго подбородка лучше всего подойдут GPT Image 2 или Nano Banana PRO: они помогают деликатно поправить контур лица и шеи."
};

const insertAfterFirstDescription = (html, sentence) => {
  if (html.includes(sentence)) return html;

  return html.replace(/(<p class="pz-desc">[\s\S]*?<\/p>)/, `$1\n  <p class="pz-desc">${sentence}</p>`);
};

let changed = 0;

for (const [file, sentence] of Object.entries(mentions)) {
  const filePath = path.join(postsDir, file);
  const post = JSON.parse(await readFile(filePath, "utf8"));
  const bodyHtml = insertAfterFirstDescription(post.bodyHtml || "", sentence);

  if (bodyHtml === post.bodyHtml) continue;

  post.bodyHtml = bodyHtml;
  await writeFile(filePath, `${JSON.stringify(post, null, 2)}\n`, "utf8");
  changed += 1;
}

console.log(`Added tool mentions to ${changed} post(s).`);
