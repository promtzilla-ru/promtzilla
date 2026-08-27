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
    <p>На обложке показан типичный сценарий: слева обычное исходное фото, справа результат, который можно получить после анализа через <a href="${ref(toolUrl, topic)}" rel="sponsored noopener" target="_blank">${toolName}</a>.</p>
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
    slug: "opredelit-dostoprimechatelnost-po-foto-s-pomoshhju-ii",
    title: "Как определить достопримечательность по фото с помощью ИИ",
    description: "Загрузи снимок здания, памятника или природного объекта, а нейросеть поможет определить название, место, эпоху и характерные признаки.",
    date: "2026-08-27",
    category: "Путешествия",
    image: "/images/posts/opredelit-dostoprimechatelnost-po-foto-s-pomoshhju-ii.png",
    imageAlt: "Определение достопримечательности по фото с помощью ИИ",
    bodyHtml: body({
      intro: `Этот промт помогает превратить неясное фото из поездки в понятную справку: что за объект в кадре, где он может находиться и по каким деталям ИИ сделал вывод.`,
      image: "/images/posts/opredelit-dostoprimechatelnost-po-foto-s-pomoshhju-ii.png",
      imageAlt: "Определение достопримечательности по фото с помощью ИИ",
      toolUrl: "https://study24.ai/tools/opredelit-dostoprimechatelnost-po-foto.html",
      topic: "dostoprimechatelnost_po_foto",
      toolName: "инструмент определения достопримечательности по фото",
      steps: [
        "Выбери фото, где хорошо видны фасад, силуэт, окружение, таблички или характерные детали объекта.",
        "Открой инструмент определения достопримечательности по фото и загрузи изображение.",
        "Скопируй промт ниже и попроси отделить уверенные признаки от предположений.",
        "Сравни ответ с картами, официальными сайтами или путеводителями, если нужна точность.",
        "Попроси ИИ оформить результат как короткую карточку для путешествия или поста."
      ],
      ruPrompt: `Определи достопримечательность или объект на фото. Дай ответ структурировано:

1. Самая вероятная версия: название объекта, город и страна.
2. Уровень уверенности в процентах.
3. Какие визуальные признаки помогли: архитектура, форма, материалы, окружение, таблички, ландшафт.
4. Две альтернативные версии, если точность не 100%.
5. Краткая историческая справка простым языком.
6. Интересные факты, которые можно проверить.
7. Что сфотографировать дополнительно, чтобы уточнить ответ.

Не выдавай предположения за факт. Если объект вымышленный, похож на несколько мест или фото слишком обрезано, честно напиши об этом.`,
      enPrompt: `Identify the landmark or object in the photo. Structure the answer:

1. Most likely version: object name, city, and country.
2. Confidence level in percent.
3. Visual clues used: architecture, shape, materials, surroundings, signs, landscape.
4. Two alternative versions if certainty is not high.
5. A short historical note in simple language.
6. Interesting facts that can be verified.
7. What extra photo angles would help confirm the answer.

Do not present assumptions as facts. If the object is fictional, resembles several places, or the photo is too cropped, say that clearly.`,
      warning: "Распознавание достопримечательностей по фото вероятностное: похожие здания, копии памятников и туристические ракурсы могут сбивать модель. Для публикации фактов сверяй результат с официальными источниками.",
      tags: ["достопримечательность по фото", "ИИ для путешествий", "распознать место", "нейросеть по фото", "промт для анализа фото"]
    })
  },
  {
    slug: "opredelit-kartinu-po-foto-cherez-nejroset",
    title: "Как определить картину по фото через нейросеть",
    description: "Промт для атрибуции картины по фотографии: вероятный автор, стиль, эпоха, техника и визуальные признаки без подмены экспертной оценки.",
    date: "2026-08-27",
    category: "Искусство",
    image: "/images/posts/opredelit-kartinu-po-foto-cherez-nejroset.png",
    imageAlt: "Определение картины по фото через нейросеть",
    bodyHtml: body({
      intro: "Такой запрос удобен, когда нужно быстро понять, что за картина перед тобой: ИИ разбирает композицию, манеру письма, сюжет и даёт аккуратную гипотезу.",
      image: "/images/posts/opredelit-kartinu-po-foto-cherez-nejroset.png",
      imageAlt: "Определение картины по фото через нейросеть",
      toolUrl: "https://study24.ai/tools/opredelit-kartinu-po-foto.html",
      topic: "kartina_po_foto",
      toolName: "инструмент определения картины по фото",
      steps: [
        "Сфотографируй картину целиком: рама, подпись, табличка и общий вид часто важны для атрибуции.",
        "Загрузи фото в инструмент определения картины по фото.",
        "Вставь промт и попроси явно указать уровень уверенности.",
        "Если есть подпись или музейная табличка, отправь отдельный крупный фрагмент.",
        "Проверь результат по музейным каталогам, аукционным базам или экспертным источникам."
      ],
      ruPrompt: `Проанализируй фото картины и попробуй определить произведение.

Сделай ответ в формате музейной карточки:
— вероятное название;
— вероятный автор или школа;
— эпоха и стиль;
— техника и материал;
— сюжет и композиция;
— визуальные признаки, на которых основан вывод;
— уровень уверенности;
— похожие авторы или произведения, если точной версии нет;
— что нужно сфотографировать крупнее: подпись, оборот, раму, табличку, фактуру мазков.

Важно: не выдавай атрибуцию за экспертное заключение. Если фото недостаточно качественное или картина похожа на стилизацию, напиши это прямо.`,
      enPrompt: `Analyze the photo of the painting and try to identify the artwork.

Format the answer as a museum catalog card:
— probable title;
— probable artist or school;
— period and style;
— technique and material;
— subject and composition;
— visual clues behind the conclusion;
— confidence level;
— similar artists or artworks if exact identification is not possible;
— what should be photographed closer: signature, back side, frame, label, brush texture.

Important: do not present attribution as expert authentication. If the photo quality is insufficient or the painting looks like a stylization, state that clearly.`,
      warning: "Нейросеть может помочь с первичным ориентиром, но не заменяет искусствоведческую экспертизу, проверку происхождения и физический осмотр работы.",
      tags: ["картина по фото", "атрибуция картины", "нейросеть для искусства", "узнать автора картины", "промт для GPT Image"]
    })
  },
  {
    slug: "opredelit-muzykalnyj-instrument-po-foto-s-pomoshhju-ii",
    title: "Как определить музыкальный инструмент по фото с помощью ИИ",
    description: "Загрузи фотографию инструмента, а ИИ поможет понять название, семейство, происхождение, способ игры и похожие варианты.",
    date: "2026-08-27",
    category: "Музыка",
    image: "/images/posts/opredelit-muzykalnyj-instrument-po-foto-s-pomoshhju-ii.png",
    imageAlt: "Определение музыкального инструмента по фото с помощью ИИ",
    bodyHtml: body({
      intro: "Этот сценарий полезен для редких, народных и старинных инструментов: модель сравнивает форму корпуса, струны, клапаны, мундштук и другие детали.",
      image: "/images/posts/opredelit-muzykalnyj-instrument-po-foto-s-pomoshhju-ii.png",
      imageAlt: "Определение музыкального инструмента по фото с помощью ИИ",
      toolUrl: "https://study24.ai/tools/opredelit-muzykalnyy-instrument-po-foto.html",
      topic: "muzykalnyj_instrument_po_foto",
      toolName: "инструмент определения музыкального инструмента по фото",
      steps: [
        "Сделай фото инструмента целиком и отдельно крупно важные детали: струны, клавиши, отверстия, смычок, мундштук.",
        "Загрузи снимок в инструмент определения музыкального инструмента по фото.",
        "Используй промт ниже, чтобы получить не только название, но и объяснение различий с похожими инструментами.",
        "Если инструмент редкий, добавь страну покупки, размер и материал.",
        "Попроси ИИ составить короткую справку для карточки товара, музея или учебного материала."
      ],
      ruPrompt: `Определи музыкальный инструмент на фото.

Ответ дай структурировано:
1. Основная версия: название инструмента.
2. Семейство: струнный, духовой, ударный, клавишный или другое.
3. Как на нём играют и какой способ звукоизвлечения используется.
4. Вероятное происхождение или культурный регион.
5. Какие детали на фото помогли: корпус, струны, гриф, отверстия, клапаны, форма, декор, материал.
6. Два похожих инструмента и чем они отличаются.
7. Уровень уверенности и что нужно показать на фото, чтобы уточнить ответ.

Не придумывай точную модель, если видны только общие признаки. Отделяй факты от предположений.`,
      enPrompt: `Identify the musical instrument in the photo.

Give a structured answer:
1. Main version: instrument name.
2. Family: string, wind, percussion, keyboard, or another type.
3. How it is played and how it produces sound.
4. Probable origin or cultural region.
5. Which details helped: body, strings, neck, holes, valves, shape, decoration, material.
6. Two similar instruments and how they differ.
7. Confidence level and what should be shown in another photo to clarify the answer.

Do not invent an exact model if only general traits are visible. Separate facts from assumptions.`,
      warning: "У редких народных инструментов бывают региональные варианты с похожей формой. Для точного музейного или оценочного описания лучше сверять ответ со специалистом.",
      tags: ["музыкальный инструмент по фото", "определить инструмент", "ИИ для музыки", "редкие инструменты", "промт по фото"]
    })
  },
  {
    slug: "opredelit-marku-mashiny-po-foto-cherez-nejroset",
    title: "Как определить марку машины по фото через нейросеть",
    description: "Промт для распознавания автомобиля по фото: марка, модель, поколение, год, кузов и видимые признаки комплектации.",
    date: "2026-08-27",
    category: "Авто",
    image: "/images/posts/opredelit-marku-mashiny-po-foto-cherez-nejroset.png",
    imageAlt: "Определение марки машины по фото через нейросеть",
    bodyHtml: body({
      intro: "Нейросеть может быстро разобрать автомобиль по фарам, решётке, силуэту, кузову и деталям салона, особенно если фото сделано с нескольких ракурсов.",
      image: "/images/posts/opredelit-marku-mashiny-po-foto-cherez-nejroset.png",
      imageAlt: "Определение марки машины по фото через нейросеть",
      toolUrl: "https://study24.ai/tools/opredelit-marku-mashiny-po-foto.html",
      topic: "marka_mashiny_po_foto",
      toolName: "инструмент определения марки машины по фото",
      steps: [
        "Выбери фото автомобиля спереди или сзади под углом; для точности добавь боковой ракурс и салон.",
        "Загрузи снимок в инструмент определения марки машины по фото.",
        "Вставь промт и попроси объяснить признаки, а не только назвать модель.",
        "Если логотип закрыт, попроси ИИ работать по форме фар, кузова и решётки.",
        "Проверь год и поколение по каталогам, если планируешь покупку или оценку."
      ],
      ruPrompt: `Определи автомобиль на фото.

Сделай структурированный разбор:
— вероятная марка;
— вероятная модель;
— поколение или примерный период выпуска;
— тип кузова;
— видимые признаки комплектации;
— уровень уверенности;
— признаки, на которых основан вывод: эмблема, фары, решётка радиатора, задние фонари, линия кузова, диски, салон;
— похожие модели, с которыми можно перепутать;
— какие дополнительные ракурсы нужны для уточнения.

Если логотип не виден или машина похожа на несколько моделей, честно укажи альтернативы. Не определяй владельца, номер или персональные данные.`,
      enPrompt: `Identify the car in the photo.

Give a structured analysis:
— probable make;
— probable model;
— generation or approximate production period;
— body type;
— visible trim features;
— confidence level;
— clues used: emblem, headlights, grille, taillights, body line, wheels, interior;
— similar models it may be confused with;
— what extra angles are needed for clarification.

If the logo is not visible or the car resembles several models, clearly list alternatives. Do not identify the owner, license plate, or personal data.`,
      warning: "Результат по фото не подходит для юридической идентификации автомобиля. Номера, VIN и данные владельца обрабатывать не нужно.",
      tags: ["марка машины по фото", "модель авто", "нейросеть для авто", "определить автомобиль", "промт автомобиль"]
    })
  },
  {
    slug: "opredelit-model-chasov-po-foto-s-pomoshhju-ii",
    title: "Как определить модель часов по фото с помощью ИИ",
    description: "Промт помогает разобрать часы по фото: бренд, линейка, референс, механизм, период выпуска и признаки подлинности без ложных гарантий.",
    date: "2026-08-27",
    category: "Вещи",
    image: "/images/posts/opredelit-model-chasov-po-foto-s-pomoshhju-ii.png",
    imageAlt: "Определение модели часов по фото с помощью ИИ",
    bodyHtml: body({
      intro: "Для часов важны мелкие детали: безель, стрелки, метки, форма корпуса, браслет и надписи на циферблате. Промт заставляет ИИ смотреть именно на них.",
      image: "/images/posts/opredelit-model-chasov-po-foto-s-pomoshhju-ii.png",
      imageAlt: "Определение модели часов по фото с помощью ИИ",
      toolUrl: "https://study24.ai/tools/opredelit-model-chasov-po-foto.html",
      topic: "model_chasov_po_foto",
      toolName: "инструмент определения модели часов по фото",
      steps: [
        "Сфотографируй часы крупно при мягком свете: циферблат, корпус, заднюю крышку, браслет и застёжку.",
        "Загрузи фото в инструмент определения модели часов по фото.",
        "Скопируй промт и попроси отделить вероятную модель от признаков подлинности.",
        "Добавь крупный кадр маркировок, если они есть.",
        "Для покупки или оценки обязательно сверяй результат с часовым мастером или официальным каталогом."
      ],
      ruPrompt: `Определи часы на фото и сделай аккуратный разбор.

Укажи:
— вероятный бренд;
— вероятную линейку или модель;
— возможный референс, если признаков достаточно;
— тип механизма: кварц, механика, автоматический, если можно предположить;
— примерный период выпуска;
— материал корпуса и браслета;
— уровень уверенности;
— признаки: циферблат, метки, стрелки, дата, безель, заводная головка, форма корпуса, браслет, маркировки;
— похожие модели и отличия;
— какие фото нужны для проверки: задняя крышка, механизм, серийный номер, застёжка.

Не подтверждай подлинность по фото. Если видны признаки реплики или стилизации, напиши осторожно и объясни почему.`,
      enPrompt: `Identify the wristwatch in the photo and provide a careful analysis.

Include:
— probable brand;
— probable line or model;
— possible reference number if there are enough clues;
— movement type: quartz, mechanical, automatic, if it can be inferred;
— approximate production period;
— case and bracelet material;
— confidence level;
— clues: dial, markers, hands, date window, bezel, crown, case shape, bracelet, markings;
— similar models and differences;
— what photos are needed for verification: caseback, movement, serial number, clasp.

Do not authenticate the watch from a photo. If there are signs of a replica or stylization, state this carefully and explain why.`,
      warning: "ИИ не подтверждает подлинность часов и не заменяет экспертизу. Для покупки, продажи и оценки нужны документы, серийные номера и очный осмотр.",
      tags: ["модель часов по фото", "определить часы", "референс часов", "ИИ для вещей", "промт часы"]
    })
  },
  {
    slug: "opredelit-model-krossovok-po-foto-cherez-ii",
    title: "Как определить модель кроссовок по фото через ИИ",
    description: "Промт для распознавания кроссовок: бренд, модель, коллекция, год, похожие силуэты и идеи, с чем носить.",
    date: "2026-08-27",
    category: "Стиль",
    image: "/images/posts/opredelit-model-krossovok-po-foto-cherez-ii.png",
    imageAlt: "Определение модели кроссовок по фото через ИИ",
    bodyHtml: body({
      intro: "Кроссовки часто узнаются по силуэту, подошве, панели носка, язычку, швам и цветовой схеме. Этот промт просит ИИ разобрать все признаки по порядку.",
      image: "/images/posts/opredelit-model-krossovok-po-foto-cherez-ii.png",
      imageAlt: "Определение модели кроссовок по фото через ИИ",
      toolUrl: "https://study24.ai/tools/opredelit-model-krossovok-po-foto.html",
      topic: "model_krossovok_po_foto",
      toolName: "инструмент определения модели кроссовок по фото",
      steps: [
        "Сделай фото сбоку, сверху и подошвы; не обрезай язычок, пятку и логотипы, если они есть.",
        "Загрузи снимок в инструмент определения модели кроссовок по фото.",
        "Вставь промт и попроси дать похожие модели, если точность низкая.",
        "Для проверки подлинности добавь фото бирки, коробки, стелек и швов.",
        "Попроси ИИ предложить 3 образа, с чем носить найденную модель."
      ],
      ruPrompt: `Определи модель кроссовок на фото.

Сделай ответ структурировано:
— вероятный бренд;
— вероятная модель или серия;
— коллекция, цветовая схема и примерный год, если можно определить;
— уровень уверенности;
— признаки, на которых основан вывод: силуэт, подошва, носок, панели, швы, язычок, пятка, логотипы, материалы;
— похожие модели, с которыми можно перепутать;
— признаки, которые нужно сфотографировать крупнее для уточнения;
— 3 идеи, с чем носить эту модель.

Не подтверждай оригинальность по одному фото. Если логотипов нет или модель вымышленная, дай вероятное описание стиля вместо точного названия.`,
      enPrompt: `Identify the sneaker model in the photo.

Structure the answer:
— probable brand;
— probable model or series;
— collection, colorway, and approximate year if possible;
— confidence level;
— clues used: silhouette, sole, toe box, panels, stitching, tongue, heel, logos, materials;
— similar models it can be confused with;
— details that should be photographed closer for clarification;
— 3 outfit ideas for styling this model.

Do not authenticate originality from a single photo. If there are no logos or the model is fictional, provide a likely style description instead of an exact name.`,
      warning: "По одному фото нельзя надёжно подтвердить оригинальность кроссовок. Для покупки проверяй бирки, коробку, стельки, качество швов и продавца.",
      tags: ["модель кроссовок по фото", "определить кроссовки", "нейросеть для стиля", "с чем носить кроссовки", "промт кроссовки"]
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
