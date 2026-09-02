import { writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const ref = (url, topic) => `https://eduforms.ru/?rid=adeaad5a9be53cc5&erid=2SDnjcsXiW6&ulp=${encodeURIComponent(url)}&subid=promtzilla&subid2=${topic}`;
const study = "https://study24.ai/";
const videoTool = "https://study24.ai/tools/analiz-video-neyrosetyu-onlayn.html";
const introTool = "https://study24.ai/tools/intro-dlya-video-cherez-neyroset-onlayn.html";
const gptImage = "https://study24.ai/chat/gpt_image";

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

const body = ({ intro, image, imageAlt, topic, toolUrl, toolName, steps, result, ruPrompt, enPrompt, warning, tags }) => `
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
    <p>${result} Под такую задачу удобно открыть <a href="${ref(toolUrl, topic)}" rel="sponsored noopener" target="_blank">${toolName}</a>, дать исходник и сразу попросить структурированный результат.</p>
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
    slug: "sozdat-oblozhku-dlya-knigi-s-pomoshhju-ii",
    title: "Как создать обложку для книги с помощью ИИ",
    breadcrumbTitle: "Создать обложку для книги через нейросеть",
    description: "Промт помогает сделать варианты книжной обложки по жанру, сюжету, аудитории и настроению, оставляя место под название и автора.",
    date: "2026-09-02",
    category: "Дизайн",
    image: "/images/posts/sozdat-oblozhku-dlya-knigi-s-pomoshhju-ii.png",
    imageAlt: "Создание обложки для книги с помощью ИИ",
    bodyHtml: body({
      intro: "Для обложки важно задать жанр, аудиторию и настроение, а не просить просто «красивую картинку». Тогда ИИ выдаёт не хаос, а направления для дизайна.",
      image: "/images/posts/sozdat-oblozhku-dlya-knigi-s-pomoshhju-ii.png",
      imageAlt: "Создание обложки для книги с помощью ИИ",
      topic: "oblozhka_knigi",
      toolUrl: gptImage,
      toolName: "GPT Image в Study24",
      steps: ["Опиши жанр, сюжет, аудиторию и тон книги.", "Укажи формат: электронная обложка, печатная книга или серия.", "Попроси несколько разных концепций, а не один финальный вариант.", "Оставь безопасную область под название, подзаголовок и автора.", "Выбери направление и отдельно попроси доработать композицию, шрифт и палитру."],
      result: "Хороший первый результат — это лист из нескольких концепций, где видно жанр, настроение и место под типографику.",
      ruPrompt: `Создай варианты обложки для книги.

Жанр: [укажи жанр]
Название: [название]
Автор: [имя автора]
Краткое описание сюжета: [описание]
Аудитория: [кто будет читать]

Сделай 6 разных концепций обложки. Для каждой сохрани безопасную область под название и имя автора, покажи настроение жанра, предложи палитру и стиль типографики. Не копируй известные книжные обложки и не используй чужие логотипы.`,
      enPrompt: `Create book cover concepts.

Genre: [specify genre]
Title: [title]
Author: [author name]
Short plot description: [description]
Audience: [readers]

Create 6 different cover concepts. For each one, keep a safe area for the title and author name, show the genre mood, suggest a color palette and typography style. Do not copy famous book covers or use third-party logos.`,
      warning: "Финальную обложку лучше доводить отдельно: проверять читаемость названия в маленьком размере и юридическую чистоту изображения.",
      tags: ["обложка книги", "дизайн обложки", "ИИ для дизайна", "книжная обложка", "промт обложка"]
    })
  },
  {
    slug: "proanalizirovat-video-s-pomoshhju-nejroseti",
    title: "Как проанализировать видео с помощью нейросети",
    breadcrumbTitle: "Проанализировать видео через ИИ",
    description: "Промт для анализа видео: сцены, герои, тональность, ключевые моменты, аудитория, таймкоды и идеи для переработки контента.",
    date: "2026-09-02",
    category: "Видео",
    image: "/images/posts/proanalizirovat-video-s-pomoshhju-nejroseti.png",
    imageAlt: "Анализ видео с помощью нейросети",
    bodyHtml: body({
      intro: "Видеоанализ полезен для разборов уроков, интервью, рекламы, вебинаров и коротких роликов: ИИ быстро выделяет структуру и слабые места.",
      image: "/images/posts/proanalizirovat-video-s-pomoshhju-nejroseti.png",
      imageAlt: "Анализ видео с помощью нейросети",
      topic: "analiz_video",
      toolUrl: videoTool,
      toolName: "анализ видео нейросетью онлайн",
      steps: ["Загрузи видео или ссылку на ролик в инструмент анализа.", "Укажи цель: краткий пересказ, маркетинговый разбор, таймкоды или сценарный анализ.", "Попроси отделить факты из видео от предположений.", "Добавь формат ответа: таблица, список сцен, выводы, рекомендации.", "Проверь спорные моменты вручную, особенно имена, даты и цифры."],
      result: "Хороший анализ должен перечислять сцены, смысловые блоки, настроение, ключевые цитаты и выводы, а не просто пересказывать ролик одним абзацем.",
      ruPrompt: `Проанализируй это видео.

Сделай:
— краткое содержание в 5-7 предложениях;
— список сцен или смысловых блоков;
— ключевые моменты с примерными таймкодами;
— тональность и настроение;
— предполагаемую аудиторию;
— сильные и слабые места;
— идеи, как использовать видео для статьи, поста или коротких роликов.

Отделяй то, что точно видно или слышно в видео, от предположений. Если качество звука или картинки мешает анализу, укажи это отдельно.`,
      enPrompt: `Analyze this video.

Provide:
— a short summary in 5-7 sentences;
— a list of scenes or semantic blocks;
— key moments with approximate timestamps;
— tone and mood;
— likely audience;
— strengths and weaknesses;
— ideas for turning the video into an article, post, or short clips.

Separate what is clearly visible or audible from assumptions. If audio or image quality limits the analysis, mention it separately.`,
      warning: "Нейросеть может ошибиться в распознавании людей, названий и фактов. Важные данные проверяй по оригиналу.",
      tags: ["анализ видео", "нейросеть видео", "таймкоды", "разбор ролика", "промт видео"]
    })
  },
  {
    slug: "poluchit-rasshifrovku-video-cherez-ii",
    title: "Как получить расшифровку видео через ИИ",
    breadcrumbTitle: "Получить расшифровку видео с помощью нейросети",
    description: "Промт помогает превратить видео в аккуратную расшифровку: спикеры, таймкоды, чистка повторов, смысловые блоки и краткое резюме.",
    date: "2026-09-02",
    category: "Видео",
    image: "/images/posts/poluchit-rasshifrovku-video-cherez-ii.png",
    imageAlt: "Получение расшифровки видео через ИИ",
    bodyHtml: body({
      intro: "Расшифровка видео нужна для статей, субтитров, конспектов и поиска цитат. Главное — заранее задать, насколько сильно чистить речь.",
      image: "/images/posts/poluchit-rasshifrovku-video-cherez-ii.png",
      imageAlt: "Получение расшифровки видео через ИИ",
      topic: "rasshifrovka_video",
      toolUrl: study,
      toolName: "Study24 AI",
      steps: ["Загрузи видео или аудиодорожку.", "Попроси распознать спикеров и сохранить таймкоды.", "Укажи режим: дословно или очищенная расшифровка.", "Попроси отдельно выделить цитаты, тезисы и спорные места.", "Сверь имена, термины и числа с оригинальным видео."],
      result: "Лучший формат — расшифровка по спикерам и таймкодам, плюс отдельное резюме, чтобы быстро понять содержание.",
      ruPrompt: `Сделай расшифровку этого видео.

Нужно:
— разделить речь по спикерам, если их несколько;
— сохранить таймкоды для важных фрагментов;
— убрать очевидные повторы, слова-паразиты и обрывы фраз;
— не менять смысл сказанного;
— отдельно выделить ключевые цитаты;
— в конце дать краткое резюме и список главных тезисов.

Если слово, имя или термин распознаны неуверенно, пометь это как [неразборчиво] или [уточнить].`,
      enPrompt: `Transcribe this video.

Requirements:
— separate speech by speakers if there are several;
— keep timestamps for important fragments;
— remove obvious repetitions, filler words, and broken phrases;
— do not change the meaning;
— highlight key quotes separately;
— provide a short summary and main takeaways at the end.

If a word, name, or term is uncertain, mark it as [unclear] or [verify].`,
      warning: "Автоматическая расшифровка особенно часто ошибается в фамилиях, брендах и профессиональных терминах.",
      tags: ["расшифровка видео", "транскрибация", "ИИ для видео", "субтитры", "конспект видео"]
    })
  },
  {
    slug: "sdelat-tajmkody-dlya-video-s-pomoshhju-nejroseti",
    title: "Как сделать таймкоды для видео с помощью нейросети",
    breadcrumbTitle: "Сделать таймкоды для видео через ИИ",
    description: "Промт создаёт оглавление видео: таймкоды, названия глав, ключевые цитаты, важные моменты и короткое описание каждого блока.",
    date: "2026-09-02",
    category: "Видео",
    image: "/images/posts/sdelat-tajmkody-dlya-video-s-pomoshhju-nejroseti.png",
    imageAlt: "Создание таймкодов для видео с помощью нейросети",
    bodyHtml: body({
      intro: "Таймкоды помогают зрителю быстро найти нужное место в длинном видео: вебинаре, интервью, лекции или обзоре.",
      image: "/images/posts/sdelat-tajmkody-dlya-video-s-pomoshhju-nejroseti.png",
      imageAlt: "Создание таймкодов для видео с помощью нейросети",
      topic: "tajmkody_dlya_video",
      toolUrl: videoTool,
      toolName: "анализ видео нейросетью онлайн",
      steps: ["Загрузи видео или расшифровку.", "Попроси найти смену тем и ключевые моменты.", "Задай формат таймкода: 00:00 — название главы.", "Попроси сделать названия короткими и понятными.", "Сверь границы глав с реальным видео и поправь минуты вручную."],
      result: "Хорошие таймкоды не должны быть слишком частыми: лучше 8-15 глав для длинного видео, чем отметка на каждую мелочь.",
      ruPrompt: `Сделай таймкоды для этого видео.

Формат:
00:00 — короткое название главы
00:00 — короткое название главы

Требования:
— выдели основные темы и повороты разговора;
— не дроби видео слишком мелко;
— названия глав делай короткими, понятными и полезными для зрителя;
— отдельно отметь самые важные цитаты или моменты;
— в конце дай краткое описание видео в 2-3 предложениях.

Если таймкод примерный, пометь его как приблизительный.`,
      enPrompt: `Create timestamps for this video.

Format:
00:00 — short chapter title
00:00 — short chapter title

Requirements:
— identify the main topics and conversation shifts;
— do not split the video into too many tiny parts;
— make chapter titles short, clear, and useful for viewers;
— separately mark the most important quotes or moments;
— provide a 2-3 sentence video description at the end.

If a timestamp is approximate, mark it as approximate.`,
      warning: "Перед публикацией таймкоды лучше открыть в плеере и проверить, что глава начинается в нужном месте.",
      tags: ["таймкоды", "главы видео", "анализ видео", "YouTube таймкоды", "промт видео"]
    })
  },
  {
    slug: "prevratit-videointervyu-v-statyu-cherez-ii",
    title: "Как превратить видеоинтервью в статью через ИИ",
    breadcrumbTitle: "Превратить видеоинтервью в статью с помощью нейросети",
    description: "Промт превращает интервью в статью: лид, структура, подзаголовки, цитаты, факты, выводы и аккуратная редактура без выдумок.",
    date: "2026-09-02",
    category: "Видео",
    image: "/images/posts/prevratit-videointervyu-v-statyu-cherez-ii.png",
    imageAlt: "Превращение видеоинтервью в статью через ИИ",
    bodyHtml: body({
      intro: "Из интервью получается сильная статья, если ИИ не просто переписывает речь, а собирает тему, конфликт, цитаты и логичную структуру.",
      image: "/images/posts/prevratit-videointervyu-v-statyu-cherez-ii.png",
      imageAlt: "Превращение видеоинтервью в статью через ИИ",
      topic: "videointervyu_v_statyu",
      toolUrl: study,
      toolName: "Study24 AI",
      steps: ["Сначала получи расшифровку интервью.", "Отметь, какие цитаты нельзя менять.", "Попроси ИИ выделить темы, факты и главный тезис.", "Сгенерируй структуру статьи с лидом и подзаголовками.", "После черновика попроси проверить, нет ли выдуманных фактов."],
      result: "Нужен журналистский черновик: понятный лид, цитаты в контексте, подзаголовки и финальный вывод.",
      ruPrompt: `Преврати это видеоинтервью или расшифровку в статью.

Материал:
[вставь расшифровку]

Сделай:
— сильный лид;
— логичную структуру статьи;
— подзаголовки;
— ключевые цитаты без искажения смысла;
— объяснение контекста;
— финальный вывод.

Важно:
— не выдумывай факты, биографию, цифры и источники;
— не приписывай человеку то, чего он не говорил;
— разговорную речь можно редактировать, но смысл цитат сохраняй;
— спорные места помечай как требующие проверки.`,
      enPrompt: `Turn this video interview or transcript into an article.

Material:
[paste transcript]

Create:
— a strong lead;
— a logical article structure;
— subheadings;
— key quotes without changing their meaning;
— context explanation;
— final takeaway.

Important:
— do not invent facts, biography, numbers, or sources;
— do not attribute statements the person did not make;
— spoken language may be edited, but quote meaning must be preserved;
— mark uncertain parts as requiring verification.`,
      warning: "Для публикации обязательно сверяй цитаты с оригиналом. Ошибка в цитате хуже обычной стилистической неточности.",
      tags: ["интервью в статью", "рерайт интервью", "ИИ для текста", "расшифровка", "статья из видео"]
    })
  },
  {
    slug: "sozdat-intro-dlya-video-s-pomoshhju-nejroseti",
    title: "Как создать интро для видео с помощью нейросети",
    breadcrumbTitle: "Создать интро для видео через ИИ",
    description: "Промт помогает придумать короткое интро: сценарий, движение камеры, анимация логотипа, звук, длительность и раскадровка.",
    date: "2026-09-02",
    category: "Видео",
    image: "/images/posts/sozdat-intro-dlya-video-s-pomoshhju-nejroseti.png",
    imageAlt: "Создание интро для видео с помощью нейросети",
    bodyHtml: body({
      intro: "Интро должно быть коротким и узнаваемым: 3-7 секунд обычно лучше, чем длинная заставка, которую зритель хочет промотать.",
      image: "/images/posts/sozdat-intro-dlya-video-s-pomoshhju-nejroseti.png",
      imageAlt: "Создание интро для видео с помощью нейросети",
      topic: "intro_dlya_video",
      toolUrl: introTool,
      toolName: "интро для видео через нейросеть",
      steps: ["Подготовь логотип, название канала и описание тематики.", "Определи длительность интро: 3, 5 или 7 секунд.", "Опиши стиль: динамичный, минималистичный, технологичный, уютный.", "Попроси раскадровку и отдельный промт для генерации видео.", "Проверь, что логотип не искажается и финальный кадр читается."],
      result: "Сначала проси раскадровку и движение, а уже потом отправляй финальный промт в видеогенератор.",
      ruPrompt: `Придумай интро для видео.

Тематика канала: [тематика]
Логотип/название: [описание]
Длительность: [3-7 секунд]
Стиль: [минимализм / динамика / техно / уютный блог / другое]

Сделай:
— идею интро;
— раскадровку по секундам;
— движение камеры;
— анимацию логотипа без искажения формы;
— цветовую палитру;
— звуковой акцент;
— финальный промт для генерации видео.

Интро должно быть коротким, не перегруженным и пригодным для повторного использования в каждом ролике.`,
      enPrompt: `Create a video intro concept.

Channel topic: [topic]
Logo/name: [description]
Duration: [3-7 seconds]
Style: [minimal / dynamic / tech / cozy vlog / other]

Create:
— intro idea;
— second-by-second storyboard;
— camera movement;
— logo animation without distorting the shape;
— color palette;
— sound accent;
— final prompt for video generation.

The intro must be short, clean, and reusable across episodes.`,
      warning: "Если интро строится вокруг логотипа, загружай исходник в хорошем качестве и отдельно проси не менять форму знака.",
      tags: ["интро для видео", "видео ИИ", "анимация логотипа", "заставка", "промт интро"]
    })
  }
];

for (const post of posts) {
  await writeFile(path.join(root, "content", "posts", `${post.slug}.json`), `${JSON.stringify(post, null, 2)}\n`, "utf8");
}

console.log(`Created ${posts.length} posts`);
