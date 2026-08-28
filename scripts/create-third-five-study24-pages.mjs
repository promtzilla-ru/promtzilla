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
    slug: "udalit-provoda-i-stolby-s-foto-cherez-nejroset",
    title: "Как удалить провода и столбы с фото через нейросеть",
    description: "Готовый промт для очистки городского кадра: убрать провода, столбы и линии, восстановить небо, фасады, перспективу и мелкие детали.",
    date: "2026-08-28",
    category: "Фото",
    image: "/images/posts/udalit-provoda-i-stolby-s-foto-cherez-nejroset.png",
    imageAlt: "Удаление проводов и столбов с фото через нейросеть",
    bodyHtml: body({
      intro: "Провода и столбы часто портят городской пейзаж. Этот промт помогает убрать их так, чтобы небо, фасады и перспектива выглядели естественно.",
      image: "/images/posts/udalit-provoda-i-stolby-s-foto-cherez-nejroset.png",
      imageAlt: "Удаление проводов и столбов с фото через нейросеть",
      toolUrl: "https://study24.ai/tools/redaktirovat-foto-onlayn-besplatno.html",
      topic: "udalit_provoda_i_stolby_s_foto",
      toolName: "инструмент редактирования фото онлайн",
      steps: [
        "Выбери фото, где провода, столбы или линии хорошо видны и не закрывают слишком много важных деталей.",
        "Загрузи изображение в инструмент редактирования фото онлайн.",
        "Если есть выделение области, отметь только провода, столбы и крепления.",
        "Вставь промт и попроси восстановить небо, фасады, окна и фактуру за удалёнными объектами.",
        "Проверь края крыш, оконные рамы и повторяющиеся элементы: там чаще всего появляются артефакты."
      ],
      ruPrompt: `Удали с фотографии провода, столбы, кабели, крепления и лишние линии.

Важно:
— измени только провода, столбы и связанные с ними элементы;
— не меняй здания, дорогу, людей, машины и общую композицию;
— восстанови небо, фасады, окна, крыши и мелкие детали за удалёнными объектами;
— сохрани перспективу, свет, тени, резкость и реалистичную фактуру;
— не оставляй размытия, повторяющихся пятен и кривых линий.

Если какие-то участки сложно восстановить точно, сделай максимально естественную версию и отдельно перечисли места, которые стоит проверить вручную.`,
      enPrompt: `Remove wires, utility poles, cables, fixtures, and unnecessary lines from the photo.

Important:
— change only the wires, poles, and related elements;
— do not change buildings, road, people, cars, or the overall composition;
— reconstruct the sky, facades, windows, roofs, and small details behind removed objects;
— preserve perspective, lighting, shadows, sharpness, and realistic texture;
— do not leave blur, repeated patches, or warped lines.

If some areas are difficult to reconstruct precisely, create the most natural version and list the parts that should be checked manually.`,
      warning: "После удаления тонких линий обязательно проверяй крыши, края зданий и окна в увеличении. Такие зоны легко выглядят правдоподобно на превью, но ломаются в деталях.",
      tags: ["удалить провода с фото", "убрать столбы", "редактирование фото ИИ", "очистить городской кадр", "нейросеть для фото"]
    })
  },
  {
    slug: "zamenit-nebo-na-foto-s-pomoshhju-ii",
    title: "Как заменить небо на фото с помощью ИИ",
    description: "Промт для реалистичной замены неба: сохранить ландшафт, горизонт, свет, отражения и цветовую температуру без неестественного эффекта.",
    date: "2026-08-28",
    category: "Фото",
    image: "/images/posts/zamenit-nebo-na-foto-s-pomoshhju-ii.png",
    imageAlt: "Замена неба на фото с помощью ИИ",
    bodyHtml: body({
      intro: "Замена неба работает лучше всего, когда ИИ понимает, что менять нужно только верхнюю часть кадра, а свет на земле должен остаться правдоподобным.",
      image: "/images/posts/zamenit-nebo-na-foto-s-pomoshhju-ii.png",
      imageAlt: "Замена неба на фото с помощью ИИ",
      toolUrl: "https://study24.ai/tools/redaktirovat-foto-onlayn-besplatno.html",
      topic: "zamenit_nebo_na_foto",
      toolName: "инструмент редактирования фото онлайн",
      steps: [
        "Выбери фото с понятной линией горизонта и без сложных волос, веток или прозрачных объектов на фоне неба.",
        "Загрузи кадр в инструмент редактирования фото онлайн.",
        "Опиши, какое небо нужно: закат, ясный день, драматичные облака или мягкая облачность.",
        "Попроси ИИ согласовать свет, цвет и отражения с новым небом.",
        "Проверь края деревьев, крыш, воды и стекла."
      ],
      ruPrompt: `Замени небо на фотографии на [опиши новое небо: закат, ясное голубое, драматичные облака, рассвет].

Важно:
— меняй только небо и связанные с ним отражения;
— сохрани ландшафт, здания, людей, деревья и все объекты без изменения формы;
— аккуратно обработай края крыш, веток, волос, воды и стекла;
— согласуй цветовую температуру, направление света и тени с новым небом;
— не делай результат слишком насыщенным или фантазийным, если я не просил этого.

Финальный кадр должен выглядеть как реальная фотография, снятая в этот момент.`,
      enPrompt: `Replace the sky in the photo with [describe the new sky: sunset, clear blue, dramatic clouds, sunrise].

Important:
— change only the sky and related reflections;
— keep landscape, buildings, people, trees, and all objects unchanged in shape;
— carefully handle edges of roofs, branches, hair, water, and glass;
— match color temperature, light direction, and shadows to the new sky;
— do not make the result too saturated or fantasy-like unless requested.

The final image should look like a real photograph taken at that moment.`,
      warning: "Самая частая ошибка при замене неба — красивое небо не совпадает со светом на земле. Проверяй тени, отражения и цвет лиц, зданий и воды.",
      tags: ["заменить небо", "небо на фото", "редактирование фото ИИ", "нейросеть для пейзажа", "промт фото"]
    })
  },
  {
    slug: "dobavit-sneg-na-foto-cherez-nejroset",
    title: "Как добавить снег на фото через нейросеть",
    description: "Промт для зимней обработки кадра: добавить снег на землю, крыши, деревья и предметы, сохранив перспективу и естественный свет.",
    date: "2026-08-28",
    category: "Фото",
    image: "/images/posts/dobavit-sneg-na-foto-cherez-nejroset.png",
    imageAlt: "Добавление снега на фото через нейросеть",
    bodyHtml: body({
      intro: "Чтобы снег выглядел естественно, его нужно добавлять не только на землю, но и на крыши, ветки, скамейки, машины и дальний план.",
      image: "/images/posts/dobavit-sneg-na-foto-cherez-nejroset.png",
      imageAlt: "Добавление снега на фото через нейросеть",
      toolUrl: "https://study24.ai/tools/redaktirovat-foto-onlayn-besplatno.html",
      topic: "dobavit_sneg_na_foto",
      toolName: "инструмент редактирования фото онлайн",
      steps: [
        "Выбери фото улицы, двора, дома или пейзажа, где хорошо видны поверхности для снега.",
        "Загрузи изображение в инструмент редактирования фото онлайн.",
        "Укажи интенсивность: лёгкий снег, свежий покров или полноценная зимняя сцена.",
        "Попроси сохранить архитектуру, предметы и перспективу без деформаций.",
        "Проверь, чтобы снег лежал на горизонтальных поверхностях и не закрывал важные лица или текст."
      ],
      ruPrompt: `Добавь на фотографию реалистичный снег и зимнюю атмосферу.

Важно:
— сохрани исходную композицию, здания, людей, предметы и перспективу;
— добавь снег на землю, крыши, подоконники, ветки, скамейки, машины и дальний план;
— сделай слой снега естественным по толщине и направлению;
— добавь мягкий холодный свет и умеренную зимнюю дымку, если это подходит кадру;
— не закрывай лица, важные детали и текст;
— не превращай фото в мультяшную или фантазийную сцену.

Результат должен выглядеть как настоящая зимняя фотография того же места.`,
      enPrompt: `Add realistic snow and a winter atmosphere to the photo.

Important:
— preserve the original composition, buildings, people, objects, and perspective;
— add snow to the ground, roofs, windowsills, branches, benches, cars, and background;
— make the snow layer natural in thickness and direction;
— add soft cold light and slight winter haze if it fits the image;
— do not cover faces, important details, or text;
— do not turn the photo into a cartoon or fantasy scene.

The result should look like a real winter photograph of the same place.`,
      warning: "Снег должен подчиняться геометрии кадра: лежать на поверхностях, цепляться за ветки и не появляться внутри помещений или под навесами без причины.",
      tags: ["добавить снег на фото", "зимняя обработка", "нейросеть для фото", "сделать зиму на фото", "промт снег"]
    })
  },
  {
    slug: "sdelat-dnevnoe-foto-nochnym-s-pomoshhju-ii",
    title: "Как сделать дневное фото ночным с помощью ИИ",
    description: "Готовый промт для превращения дневного кадра в ночной: сохранить сцену, добавить фонари, свет из окон, тени и реалистичную атмосферу.",
    date: "2026-08-28",
    category: "Фото",
    image: "/images/posts/sdelat-dnevnoe-foto-nochnym-s-pomoshhju-ii.png",
    imageAlt: "Превращение дневного фото в ночное с помощью ИИ",
    bodyHtml: body({
      intro: "День-в-ночь хорошо работает для улиц, интерьеров и пейзажей, если не просто затемнить кадр, а добавить реальные источники света.",
      image: "/images/posts/sdelat-dnevnoe-foto-nochnym-s-pomoshhju-ii.png",
      imageAlt: "Превращение дневного фото в ночное с помощью ИИ",
      toolUrl: "https://study24.ai/tools/redaktirovat-foto-onlayn-besplatno.html",
      topic: "dnevnoe_foto_nochnym",
      toolName: "инструмент редактирования фото онлайн",
      steps: [
        "Выбери дневной кадр с понятными окнами, фонарями, витринами или другими потенциальными источниками света.",
        "Загрузи фото в инструмент редактирования фото онлайн.",
        "Опиши желаемое время: сумерки, вечер, глубокая ночь или мягкий городской свет.",
        "Попроси ИИ сохранить геометрию и добавить правдоподобные источники света.",
        "Проверь, чтобы тени, окна, небо и отражения выглядели согласованно."
      ],
      ruPrompt: `Преврати дневную фотографию в реалистичную ночную сцену.

Важно:
— сохрани все объекты, композицию, перспективу и форму зданий без изменений;
— сделай небо и общий свет ночными, но не теряй детали в тенях;
— добавь естественный свет из окон, фонарей, витрин или других реальных источников;
— согласуй тени, отражения, блики и цветовую температуру;
— не добавляй неон, дождь, людей или новые объекты, если я этого не просил;
— результат должен выглядеть как настоящая фотография, а не фильтр.

Если некоторые источники света выглядят неправдоподобно, предложи более мягкую вечернюю версию.`,
      enPrompt: `Turn the daytime photo into a realistic night scene.

Important:
— preserve all objects, composition, perspective, and building shapes unchanged;
— make the sky and overall lighting nighttime, but do not lose shadow detail;
— add natural light from windows, street lamps, shop windows, or other real sources;
— match shadows, reflections, highlights, and color temperature;
— do not add neon, rain, people, or new objects unless requested;
— the result should look like a real photograph, not a filter.

If some light sources look unrealistic, suggest a softer evening version.`,
      warning: "Простое затемнение делает фото плоским. Проверяй, появились ли реальные источники света и не провалились ли важные детали в чёрный цвет.",
      tags: ["дневное фото ночным", "ночная обработка", "редактирование фото ИИ", "нейросеть для света", "промт ночь"]
    })
  },
  {
    slug: "vosstanovit-staruyu-fotografiyu-cherez-nejroset",
    title: "Как восстановить старую фотографию через нейросеть",
    description: "Промт для реставрации старого фото: убрать царапины, заломы, пыль и шум, сохранив лица, возраст и атмосферу оригинала.",
    date: "2026-08-28",
    category: "Фото",
    image: "/images/posts/vosstanovit-staruyu-fotografiyu-cherez-nejroset.png",
    imageAlt: "Восстановление старой фотографии через нейросеть",
    bodyHtml: body({
      intro: "Реставрация старых снимков требует осторожности: задача не омолодить людей и не придумать новые детали, а аккуратно восстановить повреждения.",
      image: "/images/posts/vosstanovit-staruyu-fotografiyu-cherez-nejroset.png",
      imageAlt: "Восстановление старой фотографии через нейросеть",
      toolUrl: "https://study24.ai/tools/redaktirovat-foto-onlayn-besplatno.html",
      topic: "vosstanovit_staruyu_fotografiyu",
      toolName: "инструмент редактирования фото онлайн",
      steps: [
        "Отсканируй фото или сфотографируй его без бликов, с хорошим ровным светом.",
        "Загрузи файл в инструмент редактирования фото онлайн.",
        "Вставь промт и попроси убрать только повреждения, сохранив лица и возраст.",
        "Если фото сильно повреждено, сначала восстанавливай общую чистоту, потом отдельные фрагменты.",
        "Сравни результат с оригиналом: идентичность людей важнее идеальной гладкости."
      ],
      ruPrompt: `Восстанови старую фотографию.

Сделай аккуратную реставрацию:
— убери царапины, заломы, пятна, пыль, трещины и шум;
— восстанови контраст, резкость и читаемость деталей;
— сохрани лица, возраст, мимику, одежду и позы людей;
— не омолаживай, не меняй черты лица и не дорисовывай новые детали без необходимости;
— сохрани историческую атмосферу снимка;
— не делай кожу пластиковой и не превращай фото в современную глянцевую съёмку.

Если часть изображения повреждена слишком сильно, восстанови её осторожно и отдельно укажи, где результат является предположением.`,
      enPrompt: `Restore the old photograph.

Make a careful restoration:
— remove scratches, folds, stains, dust, cracks, and noise;
— restore contrast, sharpness, and detail readability;
— preserve faces, age, expressions, clothing, and poses of people;
— do not make people younger, do not change facial features, and do not invent new details unless necessary;
— preserve the historical atmosphere of the photo;
— do not make skin plastic or turn the image into a modern glossy photoshoot.

If part of the image is too damaged, restore it cautiously and state where the result is an assumption.`,
      warning: "Всегда сохраняй оригинал старого снимка. Нейросеть может правдоподобно дорисовать детали, которых на фото не было, поэтому важные семейные архивы лучше реставрировать поэтапно.",
      tags: ["восстановить старое фото", "реставрация фото", "убрать царапины", "нейросеть для фото", "промт реставрация"]
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
