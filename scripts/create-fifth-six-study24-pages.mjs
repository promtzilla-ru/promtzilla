import { writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const ref = (url, topic) =>
  `https://eduforms.ru/?rid=adeaad5a9be53cc5&erid=2SDnjcsXiW6&ulp=${encodeURIComponent(url)}&subid=promtzilla&subid2=${topic}`;

const gptImageUrl = "https://study24.ai/chat/gpt_image";
const studyUrl = "https://study24.ai/";

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

const body = ({ intro, image, imageAlt, topic, toolUrl, toolName, steps, ruPrompt, enPrompt, result, warning, tags }) => `
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
    <div class="pz-section-label">Какой результат просить</div>
    <p>${result} Для такого сценария можно использовать <a href="${ref(toolUrl, topic)}" rel="sponsored noopener" target="_blank">${toolName}</a>: загрузи исходные материалы, вставь промт и попроси несколько вариантов.</p>
  </div>

  <div class="pz-section">
    <div class="pz-section-label">Промт</div>
    <div class="pz-card">
      <div class="pz-card-head">
        <span class="pz-ru">RU</span>
        <span class="pz-card-meta">${toolName} · русский промт</span>
        <button class="pz-copy" onclick="pzCopy(this)">Копировать</button>
      </div>
      <pre class="pz-card-body">${ruPrompt}</pre>
    </div>
    <div class="pz-card">
      <div class="pz-card-head">
        <span class="pz-en">EN</span>
        <span class="pz-card-meta">${toolName} · English prompt</span>
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
    slug: "podobrat-mebel-dlya-komnaty-po-foto-s-pomoshhju-ii",
    title: "Как подобрать мебель для комнаты по фото с помощью ИИ",
    breadcrumbTitle: "Подобрать мебель для комнаты через нейросеть",
    description: "Промт помогает загрузить фото комнаты и получить подбор мебели: стиль, размеры, расстановку, цветовые сочетания и список покупок.",
    date: "2026-09-01",
    category: "Интерьер",
    image: "/images/posts/podobrat-mebel-dlya-komnaty-po-foto-s-pomoshhju-ii.png",
    imageAlt: "Подбор мебели для комнаты по фото с помощью ИИ",
    bodyHtml: body({
      intro: "Подбор мебели по фото лучше работает, если нейросеть не просто украшает комнату, а учитывает планировку, проходы, свет и реальные размеры.",
      image: "/images/posts/podobrat-mebel-dlya-komnaty-po-foto-s-pomoshhju-ii.png",
      imageAlt: "Подбор мебели для комнаты по фото с помощью ИИ",
      topic: "podbor_mebeli_po_foto",
      toolUrl: gptImageUrl,
      toolName: "GPT Image в Study24",
      steps: [
        "Сфотографируй комнату из угла, чтобы были видны стены, окна, пол и свободное пространство.",
        "Загрузи фото в GPT Image в Study24 или другой редактор с поддержкой изображений.",
        "Опиши бюджет, стиль, ограничения по цветам и мебель, которую нельзя двигать.",
        "Попроси 2-3 варианта расстановки и отдельный список предметов.",
        "Проверь проходы, высоту мебели и совпадение с реальными размерами комнаты."
      ],
      result: "Хороший результат выглядит как реалистичная визуализация той же комнаты, где новая мебель не перекрывает проходы и сочетается с отделкой.",
      ruPrompt: `Подбери мебель для этой комнаты по фото.

Учитывай:
— планировку, окна, двери, розетки и проходы;
— стиль комнаты и существующую отделку;
— реальные пропорции мебели, чтобы предметы не выглядели слишком большими;
— удобство хранения, освещение и свободное место для движения.

Сделай 3 варианта:
1. бюджетный;
2. уютный современный;
3. более выразительный дизайнерский.

Для каждого варианта дай:
— что поставить;
— куда поставить;
— какие цвета и материалы выбрать;
— что лучше не покупать для этой комнаты.

Сохрани геометрию комнаты и не меняй окна, двери и пол.`,
      enPrompt: `Choose furniture for this room based on the photo.

Consider:
— layout, windows, doors, outlets, and walking paths;
— the room style and existing finishes;
— realistic furniture proportions;
— storage, lighting, and free space for movement.

Create 3 options:
1. budget-friendly;
2. cozy modern;
3. more expressive designer version.

For each option, provide:
— what to place;
— where to place it;
— colors and materials;
— what should be avoided for this room.

Keep the room geometry, windows, doors, and floor unchanged.`,
      warning: "Не покупай мебель только по картинке: перед заказом проверь габариты, дверные проёмы и расстояние для проходов.",
      tags: ["подбор мебели", "интерьер по фото", "ИИ для интерьера", "расстановка мебели", "промт интерьер"]
    })
  },
  {
    slug: "izmenit-interer-komnaty-cherez-nejroset",
    title: "Как изменить интерьер комнаты через нейросеть",
    breadcrumbTitle: "Изменить интерьер комнаты с помощью ИИ",
    description: "Готовый промт для редизайна комнаты: нейросеть меняет стиль, мебель, декор и цветовую палитру, сохраняя геометрию помещения.",
    date: "2026-09-01",
    category: "Интерьер",
    image: "/images/posts/izmenit-interer-komnaty-cherez-nejroset.png",
    imageAlt: "Изменение интерьера комнаты через нейросеть",
    bodyHtml: body({
      intro: "Редизайн интерьера через ИИ полезен, когда нужно быстро примерить стиль без ремонта: сканди, минимализм, джапанди, современную классику или яркий акцент.",
      image: "/images/posts/izmenit-interer-komnaty-cherez-nejroset.png",
      imageAlt: "Изменение интерьера комнаты через нейросеть",
      topic: "izmenit_interer_komnaty",
      toolUrl: gptImageUrl,
      toolName: "GPT Image в Study24",
      steps: [
        "Сделай фото комнаты без людей и лишнего беспорядка.",
        "Выбери желаемый стиль и 2-3 цвета, которые точно нравятся.",
        "Загрузи фото и попроси сохранить окна, двери, пол и общую планировку.",
        "Сначала сгенерируй мягкий вариант, потом более смелый.",
        "Отдельно попроси список изменений, которые реально повторить в жизни."
      ],
      result: "Нужен не фантазийный рендер, а понятный план: что перекрасить, что заменить, какие светильники и декор добавить.",
      ruPrompt: `Измени интерьер этой комнаты в выбранном стиле: [укажи стиль].

Сохрани:
— форму комнаты, окна, двери, пол и высоту потолка;
— основные крупные предметы, если я отдельно не прошу их заменить;
— реалистичный свет и перспективу.

Измени:
— цвет стен и текстиль;
— мебель, которая плохо сочетается со стилем;
— освещение, декор, ковёр, картины и хранение.

Сделай интерьер уютным, современным и пригодным для реальной жизни. После изображения дай список конкретных изменений: что купить, что переставить, что перекрасить.`,
      enPrompt: `Redesign this room in the following style: [specify style].

Keep:
— room shape, windows, doors, floor, and ceiling height;
— major furniture pieces unless I ask to replace them;
— realistic lighting and perspective.

Change:
— wall color and textiles;
— furniture that does not fit the style;
— lighting, decor, rug, wall art, and storage.

Make the room cozy, modern, and realistic. After the image, provide a concrete change list: what to buy, move, repaint, or replace.`,
      warning: "Для точной визуализации лучше сделать несколько фото: общий план, проблемный угол, окно и зону хранения.",
      tags: ["изменить интерьер", "нейросеть интерьер", "редизайн комнаты", "дизайн комнаты", "промт для интерьера"]
    })
  },
  {
    slug: "podobrat-cvet-sten-po-foto-komnaty-s-pomoshhju-ii",
    title: "Как подобрать цвет стен по фотографии комнаты с помощью ИИ",
    breadcrumbTitle: "Подобрать цвет стен по фото через нейросеть",
    description: "Промт подбирает палитру для стен по фото комнаты: учитывает свет, мебель, пол, текстиль и показывает несколько цветовых вариантов.",
    date: "2026-09-01",
    category: "Интерьер",
    image: "/images/posts/podobrat-cvet-sten-po-foto-komnaty-s-pomoshhju-ii.png",
    imageAlt: "Подбор цвета стен по фотографии комнаты с помощью ИИ",
    bodyHtml: body({
      intro: "Цвет стен зависит не только от вкуса: нейросеть должна смотреть на освещение, оттенок пола, мебель, текстиль и размер комнаты.",
      image: "/images/posts/podobrat-cvet-sten-po-foto-komnaty-s-pomoshhju-ii.png",
      imageAlt: "Подбор цвета стен по фотографии комнаты с помощью ИИ",
      topic: "podbor_cveta_sten",
      toolUrl: gptImageUrl,
      toolName: "GPT Image в Study24",
      steps: [
        "Сними комнату днём при естественном свете и вечером при включённых лампах.",
        "Загрузи фото и укажи, какие предметы останутся после ремонта.",
        "Попроси 5 вариантов стен: нейтральный, тёплый, холодный, акцентный и безопасный.",
        "Попроси объяснить, почему каждый цвет подходит именно этой комнате.",
        "Перед покраской проверь выбранный оттенок на выкрасах при разном освещении."
      ],
      result: "Лучший формат ответа — один главный вариант и несколько альтернатив, чтобы можно было сравнить настроение комнаты.",
      ruPrompt: `Подбери цвет стен для этой комнаты по фотографии.

Учитывай:
— естественное и искусственное освещение;
— цвет пола, мебели, дверей и текстиля;
— размер комнаты и ощущение простора;
— стиль интерьера;
— практичность цвета в реальной жизни.

Покажи 5 вариантов:
1. самый безопасный нейтральный;
2. тёплый уютный;
3. прохладный спокойный;
4. акцентный, но не кричащий;
5. вариант, который визуально расширяет комнату.

Для каждого варианта объясни, почему он подходит, и какие цвета мебели или текстиля лучше добавить.`,
      enPrompt: `Choose wall colors for this room based on the photo.

Consider:
— natural and artificial lighting;
— floor, furniture, doors, and textiles;
— room size and sense of space;
— interior style;
— real-life practicality.

Show 5 options:
1. safest neutral;
2. warm and cozy;
3. cool and calm;
4. accent color, but not loud;
5. a color that visually expands the room.

For each option, explain why it works and what furniture or textile colors should be added.`,
      warning: "Экран и генерация могут искажать оттенки. Финальный цвет всегда проверяй живым выкрасом на стене.",
      tags: ["цвет стен", "подобрать цвет", "интерьер ИИ", "ремонт комнаты", "палитра интерьера"]
    })
  },
  {
    slug: "sozdat-logotip-po-opisaniyu-cherez-nejroset",
    title: "Как создать логотип по описанию через нейросеть",
    breadcrumbTitle: "Создать логотип по описанию с помощью ИИ",
    description: "Промт помогает превратить описание бренда в несколько концепций логотипа: знак, цветовую палитру, стиль и варианты применения.",
    date: "2026-09-01",
    category: "Дизайн",
    image: "/images/posts/sozdat-logotip-po-opisaniyu-cherez-nejroset.png",
    imageAlt: "Создание логотипа по описанию через нейросеть",
    bodyHtml: body({
      intro: "Нейросеть хорошо генерирует первые идеи логотипа, если дать ей не только название, но и характер бренда, аудиторию, запреты и примеры применения.",
      image: "/images/posts/sozdat-logotip-po-opisaniyu-cherez-nejroset.png",
      imageAlt: "Создание логотипа по описанию через нейросеть",
      topic: "sozdat_logotip_po_opisaniyu",
      toolUrl: gptImageUrl,
      toolName: "GPT Image в Study24",
      steps: [
        "Опиши бренд: чем занимается, для кого, какой характер должен быть у визуала.",
        "Укажи название, если нужен текстовый логотип, или попроси только знак.",
        "Добавь запреты: без клише, без сложных деталей, без похожести на известных конкурентов.",
        "Сгенерируй 6-8 концепций и выбери 1-2 направления.",
        "Финальный знак попроси упростить и подготовить для сайта, соцсетей и аватарки."
      ],
      result: "На старте проси не один финальный логотип, а лист направлений: так легче выбрать стиль и не застрять на первой случайной идее.",
      ruPrompt: `Создай варианты логотипа по описанию бренда.

Описание бренда:
[вставь описание бизнеса, аудитории и характера бренда]

Требования:
— сделай 8 разных концепций;
— логотип должен быть простым, запоминающимся и пригодным для маленькой иконки;
— избегай клише и слишком детальных иллюстраций;
— не копируй стиль известных брендов;
— покажи варианты знака, цветовой палитры и использования на светлом/тёмном фоне;
— если используешь текст, пиши его аккуратно и без ошибок: [название].

После генерации объясни, какие 2 варианта самые сильные и почему.`,
      enPrompt: `Create logo concepts from this brand description.

Brand description:
[insert business, audience, and brand personality]

Requirements:
— create 8 different concepts;
— the logo must be simple, memorable, and usable as a small icon;
— avoid clichés and overly detailed illustrations;
— do not copy famous brand styles;
— show mark variations, color palette, and light/dark background usage;
— if text is used, write it carefully and without mistakes: [brand name].

After generating, explain which 2 concepts are strongest and why.`,
      warning: "Перед использованием проверь уникальность логотипа и права на знак. Нейросеть может случайно сделать похожую форму.",
      tags: ["создать логотип", "логотип ИИ", "брендинг", "дизайн логотипа", "промт для логотипа"]
    })
  },
  {
    slug: "sozdat-prezentaciyu-iz-teksta-s-pomoshhju-ii",
    title: "Как создать презентацию из текста с помощью ИИ",
    breadcrumbTitle: "Создать презентацию из текста через нейросеть",
    description: "Готовый промт превращает сырой текст в структуру презентации: слайды, заголовки, визуальные идеи, тезисы и заметки докладчика.",
    date: "2026-09-01",
    category: "Работа",
    image: "/images/posts/sozdat-prezentaciyu-iz-teksta-s-pomoshhju-ii.png",
    imageAlt: "Создание презентации из текста с помощью ИИ",
    bodyHtml: body({
      intro: "Чтобы получить нормальную презентацию, проси ИИ сначала собрать логику выступления, а уже потом раскладывать текст по слайдам.",
      image: "/images/posts/sozdat-prezentaciyu-iz-teksta-s-pomoshhju-ii.png",
      imageAlt: "Создание презентации из текста с помощью ИИ",
      topic: "prezentaciya_iz_teksta",
      toolUrl: studyUrl,
      toolName: "Study24 AI",
      steps: [
        "Собери исходный текст, факты, цель презентации и аудиторию.",
        "Открой Study24 AI и попроси сначала сделать структуру слайдов.",
        "Укажи формат: 7, 10 или 15 слайдов, деловой или учебный стиль.",
        "Попроси для каждого слайда заголовок, тезисы, идею визуала и заметки спикера.",
        "После структуры отдельно попроси сократить текст и усилить первые/последние слайды."
      ],
      result: "Хорошая презентация не копирует весь текст, а превращает его в сценарий: проблема, аргументы, примеры, вывод.",
      ruPrompt: `Сделай презентацию из этого текста.

Цель презентации: [укажи цель]
Аудитория: [кто будет смотреть]
Формат: [количество слайдов]
Стиль: ясный, современный, без перегруза текстом.

Исходный текст:
[вставь текст]

Подготовь:
— структуру презентации;
— заголовок каждого слайда;
— 3-5 коротких тезисов на слайд;
— идею визуала для каждого слайда;
— заметки докладчика;
— сильный первый слайд и понятный финальный вывод.

Не копируй текст абзацами. Сократи, сгруппируй и сделай логику выступления понятной.`,
      enPrompt: `Create a presentation from this text.

Presentation goal: [specify goal]
Audience: [who will watch]
Format: [number of slides]
Style: clear, modern, not overloaded with text.

Source text:
[paste text]

Prepare:
— presentation structure;
— title for each slide;
— 3-5 short bullet points per slide;
— visual idea for each slide;
— speaker notes;
— a strong opening slide and a clear final takeaway.

Do not copy full paragraphs. Condense, group, and make the presentation logic easy to follow.`,
      warning: "Факты, цифры и источники после генерации нужно проверить вручную: ИИ хорошо структурирует, но может ошибиться в деталях.",
      tags: ["презентация ИИ", "презентация из текста", "Study24 AI", "слайды", "промт презентация"]
    })
  },
  {
    slug: "sdelat-infografiku-iz-dannyh-cherez-nejroset",
    title: "Как сделать инфографику из данных через нейросеть",
    breadcrumbTitle: "Сделать инфографику из данных с помощью ИИ",
    description: "Промт помогает превратить таблицу или список фактов в понятную инфографику: структура, акценты, графики, подписи и вывод.",
    date: "2026-09-01",
    category: "Дизайн",
    image: "/images/posts/sdelat-infografiku-iz-dannyh-cherez-nejroset.png",
    imageAlt: "Создание инфографики из данных через нейросеть",
    bodyHtml: body({
      intro: "Инфографика работает, когда данные не просто красиво оформлены, а помогают быстро понять главный вывод.",
      image: "/images/posts/sdelat-infografiku-iz-dannyh-cherez-nejroset.png",
      imageAlt: "Создание инфографики из данных через нейросеть",
      topic: "infografika_iz_dannyh",
      toolUrl: studyUrl,
      toolName: "Study24 AI",
      steps: [
        "Подготовь таблицу или список фактов без лишних колонок.",
        "Сформулируй главный вывод, который должна донести инфографика.",
        "Попроси ИИ выбрать типы графиков: столбцы, круг, таймлайн, карточки чисел.",
        "Сначала сгенерируй текстовую структуру, затем визуальный макет.",
        "Проверь цифры и подписи: в инфографике ошибка заметнее, чем в обычном тексте."
      ],
      result: "Лучше просить не «сделай красиво», а указать аудиторию, главный вывод и формат публикации: статья, соцсети, презентация или отчёт.",
      ruPrompt: `Сделай инфографику из этих данных.

Данные:
[вставь таблицу, цифры или список фактов]

Цель инфографики:
[какой главный вывод нужно показать]

Требования:
— выдели главный вывод;
— выбери подходящие типы визуализации для разных данных;
— не перегружай макет текстом;
— используй короткие подписи и понятные заголовки;
— сделай структуру: заголовок, ключевые цифры, графики, пояснения, финальный вывод;
— предложи цветовую палитру и композицию.

Если данных недостаточно или они противоречат друг другу, сначала укажи проблему, а потом предложи аккуратный вариант инфографики.`,
      enPrompt: `Create an infographic from this data.

Data:
[paste table, numbers, or facts]

Infographic goal:
[what main insight should be shown]

Requirements:
— highlight the main takeaway;
— choose suitable visualization types for different data points;
— do not overload the layout with text;
— use short labels and clear headings;
— structure it as: title, key numbers, charts, explanations, final takeaway;
— suggest a color palette and composition.

If the data is incomplete or contradictory, point out the issue first and then propose a careful infographic version.`,
      warning: "Перед публикацией сверь все числа с источником. Особенно внимательно проверяй проценты, суммы и подписи к графикам.",
      tags: ["инфографика", "данные", "визуализация данных", "нейросеть дизайн", "промт инфографика"]
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

console.log(`Created ${posts.length} posts`);
