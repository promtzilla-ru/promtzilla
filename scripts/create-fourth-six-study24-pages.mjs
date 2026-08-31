import { writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const ref = (url, topic) =>
  `https://eduforms.ru/?rid=adeaad5a9be53cc5&erid=2SDnjcsXiW6&ulp=${encodeURIComponent(url)}&subid=promtzilla&subid2=${topic}`;

const toolUrl = "https://study24.ai/tools/redaktirovat-foto-onlayn-besplatno.html";

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

const body = ({ intro, image, imageAlt, topic, toolName, steps, ruPrompt, enPrompt, warning, tags }) => `
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
    <p>На обложке показан сценарий до/после: исходное фото и результат, который можно получить через <a href="${ref(toolUrl, topic)}" rel="sponsored noopener" target="_blank">${toolName}</a>.</p>
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
    slug: "raskrasit-cherno-beloe-foto-s-pomoshhju-ii",
    title: "Как раскрасить чёрно-белое фото с помощью ИИ",
    description: "Промт для аккуратной колоризации старого снимка: добавить естественные цвета кожи, одежды, архитектуры и не потерять атмосферу оригинала.",
    date: "2026-08-31",
    category: "Фото",
    image: "/images/posts/raskrasit-cherno-beloe-foto-s-pomoshhju-ii.png",
    imageAlt: "Раскрашивание чёрно-белого фото с помощью ИИ",
    bodyHtml: body({
      intro: "Колоризация работает лучше, когда ИИ не просто «делает цветным», а подбирает умеренные исторически правдоподобные оттенки.",
      image: "/images/posts/raskrasit-cherno-beloe-foto-s-pomoshhju-ii.png",
      imageAlt: "Раскрашивание чёрно-белого фото с помощью ИИ",
      topic: "raskrasit_cherno_beloe_foto",
      toolName: "инструмент редактирования фото онлайн",
      steps: [
        "Отсканируй или сфотографируй чёрно-белый снимок без бликов и сильных теней.",
        "Загрузи фото в инструмент редактирования фото онлайн.",
        "Вставь промт и попроси сохранить зерно, лица и атмосферу снимка.",
        "Если известны реальные цвета одежды, глаз или места, добавь их в запрос.",
        "Проверь кожу, волосы и фон: самые частые ошибки колоризации видны именно там."
      ],
      ruPrompt: `Раскрась чёрно-белую фотографию естественно и аккуратно.

Важно:
— сохрани лица, возраст, мимику, одежду, позы и фон без изменения;
— добавь реалистичные цвета кожи, волос, одежды, архитектуры, неба и предметов;
— используй умеренную насыщенность, без кислотных оттенков;
— сохрани фактуру старого снимка, зерно и историческую атмосферу;
— не делай кожу пластиковой и не превращай фото в современную постановочную съёмку;
— если цвет нельзя определить точно, выбирай нейтральный вероятный вариант.

Если видишь спорные зоны, перечисли их отдельно после обработки.`,
      enPrompt: `Colorize the black-and-white photograph naturally and carefully.

Important:
— preserve faces, age, expressions, clothing, poses, and background unchanged;
— add realistic colors for skin, hair, clothing, architecture, sky, and objects;
— use moderate saturation, no acidic colors;
— preserve the texture, grain, and historical atmosphere of the old photo;
— do not make skin plastic and do not turn the image into a modern staged photoshoot;
— if a color cannot be determined precisely, choose a neutral plausible version.

If there are uncertain areas, list them separately after processing.`,
      warning: "Цвета в старых фото часто являются предположением. Если важна семейная или историческая точность, добавляй известные факты в промт.",
      tags: ["раскрасить фото", "чёрно-белое фото", "колоризация ИИ", "старое фото", "промт для фото"]
    })
  },
  {
    slug: "uluchshit-kachestvo-starogo-foto-cherez-nejroset",
    title: "Как улучшить качество старого фото через нейросеть",
    description: "Готовый промт для повышения резкости и детализации старого снимка без изменения лиц, возраста, одежды и важных деталей.",
    date: "2026-08-31",
    category: "Фото",
    image: "/images/posts/uluchshit-kachestvo-starogo-foto-cherez-nejroset.png",
    imageAlt: "Улучшение качества старого фото через нейросеть",
    bodyHtml: body({
      intro: "Этот сценарий отличается от реставрации: тут главный фокус на резкости, шуме, контрасте и читаемости, а не на сильной дорисовке.",
      image: "/images/posts/uluchshit-kachestvo-starogo-foto-cherez-nejroset.png",
      imageAlt: "Улучшение качества старого фото через нейросеть",
      topic: "uluchshit_kachestvo_starogo_foto",
      toolName: "инструмент редактирования фото онлайн",
      steps: [
        "Возьми максимально качественный скан или фото оригинала.",
        "Загрузи изображение в инструмент редактирования фото онлайн.",
        "Попроси повысить качество без смены лица и без глянцевой ретуши.",
        "Если фото маленькое, укажи нужный итоговый размер или попроси мягкий апскейл.",
        "Сравни результат с оригиналом: похожесть людей важнее резкости."
      ],
      ruPrompt: `Улучши качество старой фотографии.

Сделай:
— убери цифровой шум, мутность, лёгкое размытие и низкий контраст;
— повысить резкость и читаемость деталей;
— аккуратно восстанови глаза, волосы, ткань, фон и мелкие элементы;
— сохрани лица, возраст, выражения, пропорции, одежду и позы людей;
— не дорисовывай новые черты лица и не меняй идентичность;
— не делай кожу пластиковой и не превращай фото в современную глянцевую ретушь.

Если какие-то детали не видны в оригинале, не выдумывай их слишком уверенно.`,
      enPrompt: `Improve the quality of the old photograph.

Do the following:
— remove digital noise, haze, slight blur, and low contrast;
— increase sharpness and detail readability;
— carefully restore eyes, hair, fabric, background, and small elements;
— preserve faces, age, expressions, proportions, clothing, and poses;
— do not invent new facial features and do not change identity;
— do not make skin plastic and do not turn the photo into modern glossy retouching.

If some details are not visible in the original, do not invent them too confidently.`,
      warning: "Слишком агрессивное улучшение делает людей похожими на других. Лучше просить мягкое повышение качества и сохранять оригинал рядом для сравнения.",
      tags: ["улучшить старое фото", "качество фото", "апскейл фото", "нейросеть для фото", "промт улучшение"]
    })
  },
  {
    slug: "sdelat-predmetnoe-foto-dlya-marketplejsa-s-pomoshhju-ii",
    title: "Как сделать предметное фото для маркетплейса с помощью ИИ",
    description: "Промт превращает обычное фото товара в аккуратную карточку для маркетплейса: белый фон, студийный свет, ракурсы и детали.",
    date: "2026-08-31",
    category: "Маркетплейсы",
    image: "/images/posts/sdelat-predmetnoe-foto-dlya-marketplejsa-s-pomoshhju-ii.png",
    imageAlt: "Предметное фото для маркетплейса с помощью ИИ",
    bodyHtml: body({
      intro: "Для карточки товара важно сохранить сам предмет, а улучшать только свет, фон, чистоту кадра и набор полезных ракурсов.",
      image: "/images/posts/sdelat-predmetnoe-foto-dlya-marketplejsa-s-pomoshhju-ii.png",
      imageAlt: "Предметное фото для маркетплейса с помощью ИИ",
      topic: "predmetnoe_foto_dlya_marketplejsa",
      toolName: "инструмент редактирования фото онлайн",
      steps: [
        "Сфотографируй товар без сильных бликов, закрытых углов и лишних предметов перед ним.",
        "Загрузи фото в инструмент редактирования фото онлайн.",
        "Вставь промт и попроси сохранить форму, материал и все важные элементы товара.",
        "Попроси белый фон, мягкую тень и несколько ракурсов для карточки.",
        "Проверь, что товар не изменился: размеры, цвет, текстура, кнопки и комплектующие должны совпадать."
      ],
      ruPrompt: `Сделай из этого фото товара качественное предметное фото для маркетплейса.

Важно:
— сохрани форму, цвет, материал, пропорции и все особенности товара;
— не меняй логотипы, маркировки, кнопки, упаковку и комплектацию, если они видны;
— убери лишний фон и грязные предметы вокруг;
— сделай чистый белый или светло-серый фон;
— добавь мягкий студийный свет и реалистичную тень;
— подготовь основной кадр и 3 маленьких ракурса: спереди, сбоку, деталь крупно;
— результат должен выглядеть как честная карточка товара, а не как другой продукт.

Если исходное фото не позволяет точно восстановить часть товара, напиши, какие детали требуют проверки.`,
      enPrompt: `Turn this product photo into a high-quality marketplace product image.

Important:
— preserve the product shape, color, material, proportions, and all distinctive features;
— do not change logos, markings, buttons, packaging, or included parts if visible;
— remove the messy background and surrounding objects;
— create a clean white or light gray background;
— add soft studio lighting and a realistic shadow;
— prepare the main image and 3 small angles: front, side, close-up detail;
— the result should look like an honest product card, not a different product.

If the source photo does not show part of the product clearly, state which details need checking.`,
      warning: "Для маркетплейса нельзя менять свойства товара так, чтобы покупатель получил не то, что видит на карточке. ИИ должен улучшать съёмку, а не придумывать новый продукт.",
      tags: ["предметное фото", "фото для маркетплейса", "карточка товара", "ИИ для товара", "промт маркетплейс"]
    })
  },
  {
    slug: "sozdat-reklamnyj-fon-dlya-tovara-cherez-nejroset",
    title: "Как создать рекламный фон для товара через нейросеть",
    description: "Готовый промт для рекламной сцены товара: заменить фон, сохранить продукт, согласовать свет, тени, масштаб и перспективу.",
    date: "2026-08-31",
    category: "Маркетинг",
    image: "/images/posts/sozdat-reklamnyj-fon-dlya-tovara-cherez-nejroset.png",
    imageAlt: "Создание рекламного фона для товара через нейросеть",
    bodyHtml: body({
      intro: "Рекламный фон должен усиливать товар, а не менять его. Поэтому в промте отдельно фиксируем форму, упаковку и читаемость продукта.",
      image: "/images/posts/sozdat-reklamnyj-fon-dlya-tovara-cherez-nejroset.png",
      imageAlt: "Создание рекламного фона для товара через нейросеть",
      topic: "reklamnyj_fon_dlya_tovara",
      toolName: "инструмент редактирования фото онлайн",
      steps: [
        "Выбери фото товара, где продукт хорошо виден и не перекрыт руками или другими объектами.",
        "Загрузи фото в инструмент редактирования фото онлайн.",
        "Опиши рекламную сцену: кухня, ванная, природа, спорт, премиальный интерьер или сезонная композиция.",
        "Попроси сохранить товар без изменений и согласовать свет с новой сценой.",
        "Проверь, что упаковка, форма, цвет и читаемые элементы не поменялись."
      ],
      ruPrompt: `Создай рекламный фон для товара на фото.

Сцена: [опиши нужный фон и настроение].

Важно:
— сохрани сам товар без изменения формы, цвета, размера, упаковки и пропорций;
— не меняй логотип, маркировку и читаемые элементы, если они есть;
— замени только окружение и фон;
— согласуй свет, тени, отражения, масштаб и перспективу с новым фоном;
— добавь уместные детали сцены, которые поддерживают назначение товара;
— не закрывай продукт листьями, брызгами, декором или текстом;
— результат должен выглядеть как реальная рекламная фотография.

Если фон конфликтует с товаром по свету или масштабу, предложи более естественный вариант.`,
      enPrompt: `Create an advertising background for the product in the photo.

Scene: [describe the desired background and mood].

Important:
— preserve the product itself without changing shape, color, size, packaging, or proportions;
— do not change the logo, markings, or readable elements if present;
— replace only the environment and background;
— match lighting, shadows, reflections, scale, and perspective to the new background;
— add relevant scene details that support the product use case;
— do not cover the product with leaves, splashes, decor, or text;
— the result should look like a real advertising photograph.

If the background conflicts with the product lighting or scale, suggest a more natural version.`,
      warning: "Рекламный фон не должен вводить в заблуждение: не добавляй свойства, комплектацию или размер, которых у товара нет.",
      tags: ["рекламный фон", "фон для товара", "нейросеть для рекламы", "товарная съёмка", "промт маркетинг"]
    })
  },
  {
    slug: "sdelat-virtualnuyu-primerku-odezhdy-s-pomoshhju-ii",
    title: "Как сделать виртуальную примерку одежды с помощью ИИ",
    description: "Промт для примерки одежды на фото: заменить вещь, сохранить лицо, позу, руки, фигуру, свет и естественные складки ткани.",
    date: "2026-08-31",
    category: "Стиль",
    image: "/images/posts/sdelat-virtualnuyu-primerku-odezhdy-s-pomoshhju-ii.png",
    imageAlt: "Виртуальная примерка одежды с помощью ИИ",
    bodyHtml: body({
      intro: "В примерке важнее всего сохранить человека. Меняться должна только одежда, а лицо, поза, руки, пропорции и фон остаются прежними.",
      image: "/images/posts/sdelat-virtualnuyu-primerku-odezhdy-s-pomoshhju-ii.png",
      imageAlt: "Виртуальная примерка одежды с помощью ИИ",
      topic: "virtualnaya_primerka_odezhdy",
      toolName: "инструмент редактирования фото онлайн",
      steps: [
        "Возьми фото человека в полный рост или по пояс, где хорошо видна одежда и руки.",
        "Загрузи фото в инструмент редактирования фото онлайн.",
        "Опиши новую вещь: тип, цвет, ткань, посадку, длину и стиль.",
        "Вставь промт и отдельно попроси сохранить лицо, фигуру, позу и фон.",
        "Проверь руки, талию, плечи, воротник и края ткани: там чаще всего видны ошибки."
      ],
      ruPrompt: `Замени одежду на человеке на фото.

Новая одежда: [подробно опиши вещь, цвет, ткань, посадку и стиль].

Важно:
— измени только одежду;
— сохрани лицо, волосы, фигуру, позу, руки, пропорции тела и фон;
— новая одежда должна сидеть естественно по плечам, талии, рукам и длине;
— добавь реалистичные складки, швы, фактуру ткани и тени;
— не меняй возраст, выражение лица, макияж и черты внешности;
— не добавляй логотипы и лишние аксессуары, если я не просил.

Результат должен выглядеть как реальная примерка этой одежды на том же человеке.`,
      enPrompt: `Replace the clothing on the person in the photo.

New clothing: [describe the garment, color, fabric, fit, and style in detail].

Important:
— change only the clothing;
— preserve face, hair, body shape, pose, hands, body proportions, and background;
— the new clothing should fit naturally around shoulders, waist, arms, and length;
— add realistic folds, seams, fabric texture, and shadows;
— do not change age, facial expression, makeup, or appearance;
— do not add logos or extra accessories unless requested.

The result should look like a real try-on of this clothing on the same person.`,
      warning: "Виртуальная примерка даёт визуальную оценку, но не гарантирует реальную посадку, размер и качество ткани. Для покупки проверяй размерную сетку и возврат.",
      tags: ["виртуальная примерка", "примерить одежду", "ИИ для одежды", "заменить одежду на фото", "промт стиль"]
    })
  },
  {
    slug: "izmenit-stil-odezhdy-na-foto-cherez-nejroset",
    title: "Как изменить стиль одежды на фото через нейросеть",
    description: "Промт для смены образа на фото: casual, деловой, streetwear или old money без изменения лица, фигуры, позы и фона.",
    date: "2026-08-31",
    category: "Стиль",
    image: "/images/posts/izmenit-stil-odezhdy-na-foto-cherez-nejroset.png",
    imageAlt: "Изменение стиля одежды на фото через нейросеть",
    bodyHtml: body({
      intro: "Этот сценарий нужен, когда хочется примерить не конкретную вещь, а весь образ: деловой, вечерний, streetwear, минимализм или другой стиль.",
      image: "/images/posts/izmenit-stil-odezhdy-na-foto-cherez-nejroset.png",
      imageAlt: "Изменение стиля одежды на фото через нейросеть",
      topic: "izmenit_stil_odezhdy_na_foto",
      toolName: "инструмент редактирования фото онлайн",
      steps: [
        "Выбери фото, где человек хорошо виден и одежда не закрыта сумкой, руками или мебелью.",
        "Загрузи изображение в инструмент редактирования фото онлайн.",
        "Опиши желаемый стиль: деловой, casual, old money, streetwear, вечерний или минимализм.",
        "Попроси сохранить лицо, позу, фон и пропорции тела.",
        "Проверь, чтобы образ выглядел цельно: обувь, верх, низ и аксессуары должны сочетаться."
      ],
      ruPrompt: `Измени стиль одежды человека на фото.

Новый стиль: [укажи стиль: деловой, old money, streetwear, вечерний, минимализм, casual].

Важно:
— меняй только одежду, обувь и уместные аксессуары;
— сохрани лицо, волосы, фигуру, позу, руки, фон и освещение;
— одежда должна сидеть естественно и соответствовать пропорциям тела;
— подбери цельный образ: верх, низ, обувь, фактура ткани и цветовая гамма;
— не добавляй логотипы, надписи и слишком заметные бренды;
— не меняй возраст, черты лица и выражение.

Сделай результат реалистичным, как настоящую фотографию в новом образе.`,
      enPrompt: `Change the clothing style of the person in the photo.

New style: [specify the style: business, old money, streetwear, evening, minimal, casual].

Important:
— change only clothing, shoes, and suitable accessories;
— preserve face, hair, body shape, pose, hands, background, and lighting;
— clothing should fit naturally and match body proportions;
— create a cohesive outfit: top, bottom, shoes, fabric texture, and color palette;
— do not add logos, text, or obvious brands;
— do not change age, facial features, or expression.

Make the result realistic, like a real photograph in a new outfit.`,
      warning: "Смена стиля может красиво показать направление, но не заменяет стилиста и примерку. Проверяй, чтобы ИИ не изменил лицо, фигуру или руки.",
      tags: ["изменить стиль одежды", "сменить образ", "нейросеть для стиля", "одежда на фото", "промт стиль"]
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
