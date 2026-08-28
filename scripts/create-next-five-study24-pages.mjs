import { writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const ref = (url, topic) =>
  `https://eduforms.ru/?rid=adeaad5a9be53cc5&erid=2SDnjcsXiW6&ulp=${encodeURIComponent(url)}&subid=promtzilla&subid2=${topic}`;

const copyScript = `<script>
function pzCopy(btn) {
  var card = btn.closest('.pz-card, .pz-mini');
  var body = card.querySelector('.pz-card-body, .pz-mini-body');
  if (!body) return;
  navigator.clipboard.writeText(body.innerText).then(function() {
    btn.textContent = 'Скопировано';
    btn.classList.add('ok');
    setTimeout(function() {
      btn.textContent = 'Копировать';
      btn.classList.remove('ok');
    }, 2000);
  });
}
</script>`;

const body = ({ intro, image, imageAlt, toolUrl, topic, toolName, steps, ruPrompt, enPrompt, warning, tags }) => `
<div class="pz-wrap">
  <p class="pz-eyebrow">Промтзилла</p>
  <p class="pz-desc">${intro}</p>

  <figure class="pz-photo-item">
    <div class="pz-photo-img pz-photo-img--wide"><img src="${image}" alt="${imageAlt}"></div>
    <figcaption class="pz-photo-cap"><span class="pz-badge-result">Пример</span>${imageAlt}</figcaption>
  </figure>

  <div class="pz-howto">
    <div class="pz-howto-title">Пошаговая инструкция</div>
    <ul class="pz-steps">
      ${steps.map((step, index) => `<li class="pz-step"><div class="pz-step-num">${index + 1}</div><div class="pz-step-text">${step}</div></li>`).join("\n      ")}
    </ul>
  </div>

  <div class="pz-section">
    <div class="pz-section-label">Пример результата</div>
    <p>На обложке показан типичный сценарий: слева исходное фото, справа результат, который можно получить через <a href="${ref(toolUrl, topic)}" rel="sponsored noopener" target="_blank">${toolName}</a>.</p>
  </div>

  <div class="pz-section">
    <div class="pz-section-label">Промт</div>
    <div class="pz-card">
      <div class="pz-card-head">
        <span class="pz-ru">RU</span>
        <span class="pz-card-meta">${toolName} · загрузи фото</span>
        <button class="pz-copy" onclick="pzCopy(this)">Копировать</button>
      </div>
      <pre class="pz-card-body">${ruPrompt}</pre>
    </div>
    <div class="pz-card">
      <div class="pz-card-head">
        <span class="pz-en">EN</span>
        <span class="pz-card-meta">${toolName} · upload image</span>
        <button class="pz-copy" onclick="pzCopy(this)">Копировать</button>
      </div>
      <pre class="pz-card-body">${enPrompt}</pre>
    </div>
  </div>

  <div class="pz-section">
    <div class="pz-section-label">Важно</div>
    <p>${warning}</p>
  </div>

  <div class="pz-divider"></div>

  <div class="pz-section">
    <div class="pz-section-label">Теги</div>
    <div class="pz-tags">${tags.map((tag) => `<span class="pz-tag">#${tag}</span>`).join("")}</div>
  </div>
</div>
${copyScript}`;

const posts = [
  {
    slug: "opredelit-brend-odezhdy-po-foto-s-pomoshhju-nejroseti",
    title: "Как определить бренд одежды по фото с помощью нейросети",
    description: "Загрузи фото вещи, а ИИ поможет определить вероятный бренд, стиль, материал, крой и похожие варианты без уверенных выдумок.",
    date: "2026-08-28",
    category: "Стиль",
    image: "/images/posts/opredelit-brend-odezhdy-po-foto-s-pomoshhju-nejroseti.png",
    imageAlt: "Определение бренда одежды по фото с помощью нейросети",
    bodyHtml: body({
      intro: "Этот промт полезен, когда нужно понять, что за вещь на фото: ИИ разбирает крой, ткань, фурнитуру, бирку, логотип и стилистические признаки.",
      image: "/images/posts/opredelit-brend-odezhdy-po-foto-s-pomoshhju-nejroseti.png",
      imageAlt: "Определение бренда одежды по фото с помощью нейросети",
      toolUrl: "https://study24.ai/tools/opredelit-brend-odezhdy-po-foto.html",
      topic: "brend_odezhdy_po_foto",
      toolName: "инструмент определения бренда одежды по фото",
      steps: [
        "Сфотографируй вещь целиком и отдельно крупно бирку, фурнитуру, швы и логотип, если он есть.",
        "Загрузи фото в инструмент определения бренда одежды по фото.",
        "Вставь промт и попроси указать не только бренд, но и признаки, на которых основан вывод.",
        "Если бренд не определяется, попроси ИИ описать стиль и найти похожие категории вещей.",
        "Для покупки или проверки оригинальности сверяй результат с бирками, продавцом и официальными каталогами."
      ],
      ruPrompt: `Определи одежду на фото и сделай аккуратный разбор.

Укажи:
— вероятный бренд, если он виден по логотипу, бирке или характерным деталям;
— тип вещи и стиль;
— материал или вероятный состав ткани;
— особенности кроя, посадки и силуэта;
— фурнитуру, швы, застёжки, карманы и декоративные элементы;
— уровень уверенности;
— похожие бренды или категории, если точного ответа нет;
— что нужно сфотографировать крупнее для уточнения.

Не выдавай догадку за факт. Если логотипа или бирки не видно, не придумывай бренд, а опиши вероятный стиль и признаки.`,
      enPrompt: `Identify the clothing item in the photo and provide a careful analysis.

Include:
— probable brand if visible from a logo, label, or distinctive details;
— item type and style;
— material or likely fabric composition;
— cut, fit, and silhouette features;
— hardware, stitching, closures, pockets, and decorative elements;
— confidence level;
— similar brands or categories if exact identification is not possible;
— what details should be photographed closer.

Do not present guesses as facts. If no logo or label is visible, do not invent a brand; describe the likely style and visual clues instead.`,
      warning: "По одному фото нельзя надёжно подтвердить бренд и оригинальность вещи. Для покупки проверяй бирки, швы, фурнитуру, документы и репутацию продавца.",
      tags: ["бренд одежды по фото", "определить одежду", "нейросеть для стиля", "проверить вещь по фото", "промт одежда"]
    })
  },
  {
    slug: "opredelit-model-sumki-po-foto-cherez-ii",
    title: "Как определить модель сумки по фото через ИИ",
    description: "Промт для распознавания сумки по фотографии: форма, материал, фурнитура, вероятная модель, похожие варианты и ограничения проверки.",
    date: "2026-08-28",
    category: "Стиль",
    image: "/images/posts/opredelit-model-sumki-po-foto-cherez-ii.png",
    imageAlt: "Определение модели сумки по фото через ИИ",
    bodyHtml: body({
      intro: "Для сумок важны форма, ручки, замок, кожа, швы, внутренние детали и пропорции. Этот промт заставляет ИИ смотреть на них последовательно.",
      image: "/images/posts/opredelit-model-sumki-po-foto-cherez-ii.png",
      imageAlt: "Определение модели сумки по фото через ИИ",
      toolUrl: "https://study24.ai/tools/opredelit-model-sumki-po-foto.html",
      topic: "model_sumki_po_foto",
      toolName: "инструмент определения модели сумки по фото",
      steps: [
        "Сделай фото сумки спереди, сбоку, внутри и крупно фурнитуру, швы, замок, ручки и бирку.",
        "Загрузи снимок в инструмент определения модели сумки по фото.",
        "Скопируй промт и попроси разделить вероятную модель, похожие варианты и признаки.",
        "Если нужна цена, проси только ориентировочный диапазон и источник логики.",
        "Не используй ответ как проверку подлинности без эксперта и документов."
      ],
      ruPrompt: `Определи сумку на фото.

Сделай структурированный ответ:
— вероятный бренд или стиль, если бренд не виден;
— вероятная модель или тип сумки;
— материал и фактура;
— форма, размер, ручки, застёжка, фурнитура, швы и внутренние детали;
— примерный ценовой диапазон только как ориентир;
— уровень уверенности;
— похожие модели, с которыми можно перепутать;
— какие фото нужны для уточнения: бирка, внутренняя часть, фурнитура, дно, застёжка.

Не подтверждай подлинность по фото. Если логотипа нет или сумка вымышленная, дай описание стиля вместо точного названия.`,
      enPrompt: `Identify the handbag in the photo.

Give a structured answer:
— probable brand or style if the brand is not visible;
— probable model or bag type;
— material and texture;
— shape, size, handles, closure, hardware, stitching, and interior details;
— approximate price range only as a rough orientation;
— confidence level;
— similar models it can be confused with;
— what photos are needed for clarification: label, interior, hardware, bottom, closure.

Do not authenticate the bag from a photo. If there is no logo or the bag is fictional, provide a style description instead of an exact name.`,
      warning: "ИИ может ошибаться в брендах, сезонах и ценах. Для продажи, покупки и проверки оригинальности нужны документы, серийные данные и экспертный осмотр.",
      tags: ["модель сумки по фото", "определить сумку", "бренд сумки", "ИИ для вещей", "промт сумка"]
    })
  },
  {
    slug: "opredelit-rakushku-po-foto-s-pomoshhju-nejroseti",
    title: "Как определить ракушку по фото с помощью нейросети",
    description: "Промт помогает определить ракушку по фотографии: форма, рельеф, окраска, среда обитания, редкость и правила обращения с находкой.",
    date: "2026-08-28",
    category: "Природа",
    image: "/images/posts/opredelit-rakushku-po-foto-s-pomoshhju-nejroseti.png",
    imageAlt: "Определение ракушки по фото с помощью нейросети",
    bodyHtml: body({
      intro: "Если нашёл ракушку на пляже или в коллекции, ИИ может дать первичную справку: на что она похожа, какие признаки важны и что проверить дальше.",
      image: "/images/posts/opredelit-rakushku-po-foto-s-pomoshhju-nejroseti.png",
      imageAlt: "Определение ракушки по фото с помощью нейросети",
      toolUrl: "https://study24.ai/tools/opredelit-rakushku-po-foto.html",
      topic: "rakushka_po_foto",
      toolName: "инструмент определения ракушки по фото",
      steps: [
        "Сфотографируй ракушку сверху, сбоку и со стороны устья; положи рядом монету или линейку для масштаба.",
        "Загрузи фото в инструмент определения ракушки по фото.",
        "Вставь промт и попроси объяснить признаки: форму, завиток, рельеф, цвет и размер.",
        "Укажи место находки, если знаешь пляж, море или страну.",
        "Проверь правила региона: некоторые виды и находки нельзя вывозить или собирать."
      ],
      ruPrompt: `Определи ракушку на фото.

Ответ дай как научно-популярную карточку:
— вероятный вид или семейство;
— уровень уверенности;
— признаки: форма, завиток, устье, рёбра, рельеф, цвет, полосы, размер;
— возможная среда обитания;
— редкость и похожие виды;
— можно ли безопасно брать такую находку, какие ограничения бывают;
— что нужно сфотографировать дополнительно для уточнения.

Если вид нельзя определить точно, не придумывай латинское название. Дай осторожную версию и объясни, какие признаки недостаточно видны.`,
      enPrompt: `Identify the seashell in the photo.

Answer as a popular science card:
— probable species or family;
— confidence level;
— clues: shape, spiral, aperture, ribs, texture, color, bands, size;
— possible habitat;
— rarity and similar species;
— whether it is safe/legal to collect such a find and what restrictions may exist;
— what should be photographed additionally for clarification.

If the species cannot be identified accurately, do not invent a Latin name. Give a cautious version and explain which features are not visible enough.`,
      warning: "Определение ракушек по фото приблизительное. Не собирай живые организмы и проверяй местные правила, особенно в заповедниках и при вывозе находок через границу.",
      tags: ["ракушка по фото", "определить ракушку", "нейросеть для природы", "морские ракушки", "промт природа"]
    })
  },
  {
    slug: "prevratit-foto-v-podrobnyj-prompt-cherez-ii",
    title: "Как превратить фото в подробный промпт через ИИ",
    description: "Промт помогает разобрать изображение на сюжет, композицию, свет, камеру, стиль, палитру и получить готовый запрос для генерации похожей картинки.",
    date: "2026-08-28",
    category: "Промпты",
    image: "/images/posts/prevratit-foto-v-podrobnyj-prompt-cherez-ii.png",
    imageAlt: "Превращение фото в подробный промпт через ИИ",
    bodyHtml: body({
      intro: "Этот сценарий нужен, когда нравится картинка и хочется понять, каким запросом можно получить похожий визуал без прямого копирования.",
      image: "/images/posts/prevratit-foto-v-podrobnyj-prompt-cherez-ii.png",
      imageAlt: "Превращение фото в подробный промпт через ИИ",
      toolUrl: "https://study24.ai/tools/prevratit-foto-v-promt.html",
      topic: "foto_v_podrobnyj_prompt",
      toolName: "инструмент превращения фото в промпт",
      steps: [
        "Загрузи изображение, стиль которого хочешь повторить или адаптировать.",
        "Открой инструмент превращения фото в промпт.",
        "Вставь промт ниже и попроси структурировать ответ по блокам.",
        "Удали из результата имена брендов, авторов и узнаваемых персонажей, если они не нужны.",
        "Сгенерируй новую картинку по промпту и уточняй свет, композицию или формат."
      ],
      ruPrompt: `Разбери изображение и преврати его в подробный промпт для генерации похожей картинки.

Сделай структуру:
1. Короткое описание сюжета.
2. Главные объекты и их расположение.
3. Композиция и ракурс.
4. Свет, время суток и настроение.
5. Камера, объектив, глубина резкости, если это похоже на фото.
6. Цветовая палитра.
7. Материалы, фактуры и важные детали.
8. Стиль изображения.
9. Формат кадра и соотношение сторон.
10. Негативный промпт: что исключить.
11. Готовый промпт на русском.
12. Готовый промпт на английском.

Не копируй узнаваемого автора, бренд, персонажа или логотип. Сохрани общую визуальную идею, но сформулируй её как оригинальный запрос.`,
      enPrompt: `Analyze the image and turn it into a detailed prompt for generating a similar image.

Use this structure:
1. Short scene description.
2. Main objects and their placement.
3. Composition and camera angle.
4. Lighting, time of day, and mood.
5. Camera, lens, depth of field, if it looks photographic.
6. Color palette.
7. Materials, textures, and important details.
8. Image style.
9. Frame format and aspect ratio.
10. Negative prompt: what to exclude.
11. Final prompt in Russian.
12. Final prompt in English.

Do not copy a recognizable artist, brand, character, or logo. Preserve the general visual idea, but phrase it as an original prompt.`,
      warning: "Не используй этот подход для копирования чужого стиля один в один, логотипов, персонажей и защищённых материалов. Лучше брать структуру сцены и визуальные принципы.",
      tags: ["фото в промпт", "промпт по картинке", "image to prompt", "ИИ для промптов", "генерация изображений"]
    })
  },
  {
    slug: "ubrat-lishnego-cheloveka-s-foto-s-pomoshhju-ii",
    title: "Как убрать лишнего человека с фото с помощью ИИ",
    description: "Готовый промт для удаления человека с фотографии: восстановить фон, сохранить главных людей, перспективу, тени и естественные детали кадра.",
    date: "2026-08-28",
    category: "Фото",
    image: "/images/posts/ubrat-lishnego-cheloveka-s-foto-s-pomoshhju-ii.png",
    imageAlt: "Удаление лишнего человека с фото с помощью ИИ",
    bodyHtml: body({
      intro: "Такой промт помогает убрать случайного прохожего, человека на заднем плане или лишнюю фигуру в кадре, не меняя остальных участников фотографии.",
      image: "/images/posts/ubrat-lishnego-cheloveka-s-foto-s-pomoshhju-ii.png",
      imageAlt: "Удаление лишнего человека с фото с помощью ИИ",
      toolUrl: "https://study24.ai/tools/redaktirovat-foto-onlayn-besplatno.html",
      topic: "ubrat_lishnego_cheloveka_s_foto",
      toolName: "инструмент редактирования фото онлайн",
      steps: [
        "Выбери фото, где понятно, какого человека нужно удалить, а кого сохранить.",
        "Загрузи изображение в инструмент редактирования фото онлайн.",
        "Если интерфейс позволяет выделить область, аккуратно отметь только лишнего человека.",
        "Вставь промт и попроси восстановить фон, тени и фактуру за удалённым объектом.",
        "Проверь края, руки, лица, тени и повторяющиеся узоры; при необходимости попроси исправить только проблемное место."
      ],
      ruPrompt: `Удали с фотографии лишнего человека: [опиши кого именно удалить].

Важно:
— измени только указанного человека;
— сохрани всех остальных людей без изменений;
— не меняй лица, одежду, позы и пропорции главных людей;
— восстанови фон за удалённым человеком естественно;
— сохрани перспективу, свет, тени, отражения, текстуры пола, стен и предметов;
— не добавляй новых людей и объектов;
— не размывай участок удаления, результат должен выглядеть как обычная фотография.

Если область сложная, сначала сделай максимально естественную версию, а затем отдельно укажи, какие места требуют ручной проверки.`,
      enPrompt: `Remove the unwanted person from the photo: [describe exactly whom to remove].

Important:
— change only the specified person;
— keep all other people unchanged;
— do not alter faces, clothing, poses, or body proportions of the main people;
— naturally reconstruct the background behind the removed person;
— preserve perspective, lighting, shadows, reflections, floor/wall/object textures;
— do not add new people or objects;
— do not blur the removal area; the result should look like a normal photograph.

If the area is complex, create the most natural version first, then list which parts may need manual checking.`,
      warning: "Не используй удаление людей для обмана, травли или подделки значимых событий. Для личных фото лучше сохранять оригинал и работать с копией.",
      tags: ["убрать человека с фото", "удалить прохожего", "редактирование фото ИИ", "восстановить фон", "промт для фото"]
    })
  }
];

for (const post of posts) {
  await writeFile(
    path.join(root, "content", "posts", `${post.slug}.json`),
    `${JSON.stringify(post, null, 2)}\n`,
    "utf8"
  );
}

console.log(`Created ${posts.length} Study24 post files.`);
