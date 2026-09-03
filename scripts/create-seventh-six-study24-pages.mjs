import { writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const ref = (url, topic) => `https://eduforms.ru/?rid=adeaad5a9be53cc5&erid=2SDnjcsXiW6&ulp=${encodeURIComponent(url)}&subid=promtzilla&subid2=${topic}`;
const study = "https://study24.ai/";
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
    <p>${result} Для старта можно использовать <a href="${ref(toolUrl, topic)}" rel="sponsored noopener" target="_blank">${toolName}</a>: добавь исходник, цель и ограничения, а затем попроси вариант для публикации.</p>
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
    slug: "ozhivit-logotip-cherez-nejroset",
    title: "Как оживить логотип через нейросеть",
    breadcrumbTitle: "Оживить логотип с помощью ИИ",
    description: "Промт помогает анимировать логотип: появление, движение, финальная фиксация, прозрачный фон и сохранение формы знака.",
    date: "2026-09-03",
    category: "Видео",
    image: "/images/posts/ozhivit-logotip-cherez-nejroset.png",
    imageAlt: "Оживление логотипа через нейросеть",
    bodyHtml: body({
      intro: "Логотип в анимации должен остаться узнаваемым: нейросеть можно просить двигать свет, контур и фон, но не менять сам знак.",
      image: "/images/posts/ozhivit-logotip-cherez-nejroset.png",
      imageAlt: "Оживление логотипа через нейросеть",
      topic: "ozhivit_logotip",
      toolUrl: study,
      toolName: "Study24 AI",
      steps: ["Подготовь логотип в хорошем качестве, лучше PNG или SVG.", "Опиши длительность: 3-5 секунд для заставки обычно достаточно.", "Укажи, какие элементы можно анимировать: контур, свет, частицы, масштаб.", "Отдельно запрети менять форму, цвета и пропорции знака.", "Попроси финальный кадр с логотипом в центре и прозрачный фон, если это нужно для монтажа."],
      result: "Хороший результат выглядит как короткая заставка: логотип появился, сделал одно аккуратное движение и зафиксировался.",
      ruPrompt: `Оживи этот логотип для короткой заставки.

Требования:
— длительность 3-5 секунд;
— сохрани форму, цвета, пропорции и читаемость логотипа;
— не добавляй новые буквы и не меняй знак;
— сделай аккуратное появление: контур, лёгкое свечение, движение или частицы;
— финальный кадр должен быть статичным и чистым;
— если возможно, подготовь вариант на прозрачном фоне.

После результата опиши анимацию по секундам, чтобы её можно было повторить в видеоредакторе.`,
      enPrompt: `Animate this logo for a short intro.

Requirements:
— duration 3-5 seconds;
— preserve the logo shape, colors, proportions, and readability;
— do not add new letters or change the mark;
— create a clean reveal: outline, soft glow, motion, or particles;
— the final frame must be static and clean;
— if possible, prepare a transparent background version.

After the result, describe the animation second by second so it can be recreated in a video editor.`,
      warning: "Если логотип зарегистрирован, не разрешай нейросети менять знак: даже небольшие искажения могут испортить фирменный стиль.",
      tags: ["оживить логотип", "анимация логотипа", "видео ИИ", "заставка", "брендинг"]
    })
  },
  {
    slug: "sozdat-video-iz-fotografii-s-pomoshhju-ii",
    title: "Как создать видео из фотографии с помощью ИИ",
    breadcrumbTitle: "Создать видео из фотографии через нейросеть",
    description: "Промт превращает одно фото в короткое видео: движение камеры, мимика, ветер, свет, глубина кадра и сохранение исходного образа.",
    date: "2026-09-03",
    category: "Видео",
    image: "/images/posts/sozdat-video-iz-fotografii-s-pomoshhju-ii.png",
    imageAlt: "Создание видео из фотографии с помощью ИИ",
    bodyHtml: body({
      intro: "Фото оживает лучше, когда движение минимальное: лёгкий зум, панорама, ветер, свет и естественная глубина работают надёжнее резкой смены сцены.",
      image: "/images/posts/sozdat-video-iz-fotografii-s-pomoshhju-ii.png",
      imageAlt: "Создание видео из фотографии с помощью ИИ",
      topic: "video_iz_fotografii",
      toolUrl: study,
      toolName: "Study24 AI",
      steps: ["Выбери чёткое фото без смазанных лиц и лишних объектов.", "Опиши длительность ролика и формат: 9:16, 1:1 или 16:9.", "Попроси сохранить лицо, одежду, фон и стиль исходника.", "Задай одно главное движение: медленный зум, поворот камеры или лёгкий ветер.", "Проверь руки, лицо и края кадра: там чаще всего появляются артефакты."],
      result: "Нужен короткий реалистичный фрагмент, где фото будто снято на видео, а не полностью переделано.",
      ruPrompt: `Создай короткое видео из этой фотографии.

Параметры:
— длительность: [укажи 3-8 секунд];
— формат: [16:9 / 9:16 / 1:1];
— движение камеры: медленный плавный зум и лёгкая панорама;
— добавь естественное движение света, волос, одежды или фона, если это уместно.

Важно:
— сохрани лицо, позу, одежду, фон и стиль исходного фото;
— не добавляй новых людей или предметы;
— не меняй возраст и внешность;
— избегай резких движений и пластиковой мимики.`,
      enPrompt: `Create a short video from this photo.

Parameters:
— duration: [3-8 seconds];
— format: [16:9 / 9:16 / 1:1];
— camera motion: slow smooth zoom and slight pan;
— add natural movement of light, hair, clothing, or background if appropriate.

Important:
— preserve the face, pose, clothing, background, and style of the original photo;
— do not add new people or objects;
— do not change age or appearance;
— avoid abrupt movement and plastic facial animation.`,
      warning: "Для портретов лучше просить минимальное движение: чем активнее мимика, тем выше риск странных артефактов.",
      tags: ["видео из фото", "оживить фото", "ИИ видео", "анимация фото", "промт видео"]
    })
  },
  {
    slug: "sozdat-subtitry-dlya-video-s-pomoshhju-ii",
    title: "Как создать субтитры для видео с помощью ИИ",
    breadcrumbTitle: "Создать субтитры для видео через нейросеть",
    description: "Промт помогает сделать субтитры: распознать речь, разделить спикеров, вычитать текст, подготовить SRT и короткие строки.",
    date: "2026-09-03",
    category: "Видео",
    image: "/images/posts/sozdat-subtitry-dlya-video-s-pomoshhju-ii.png",
    imageAlt: "Создание субтитров для видео с помощью ИИ",
    bodyHtml: body({
      intro: "Субтитры должны быть короткими и читабельными: зритель не успевает читать длинные абзацы поверх видео.",
      image: "/images/posts/sozdat-subtitry-dlya-video-s-pomoshhju-ii.png",
      imageAlt: "Создание субтитров для видео с помощью ИИ",
      topic: "subtitry_dlya_video",
      toolUrl: study,
      toolName: "Study24 AI",
      steps: ["Загрузи видео или аудио.", "Попроси расшифровку с таймкодами.", "Укажи формат субтитров: SRT, VTT или текстовый список.", "Попроси делать строки короткими и не ломать фразы в неудобных местах.", "Проверь имена, термины и синхронизацию с видео."],
      result: "Хороший файл субтитров содержит точные таймкоды, короткие строки и понятное разделение спикеров.",
      ruPrompt: `Создай субтитры для этого видео.

Нужно:
— распознать речь;
— сохранить таймкоды;
— разделить спикеров, если их несколько;
— убрать явные повторы и слова-паразиты, но не менять смысл;
— сделать короткие строки, удобные для чтения на экране;
— подготовить результат в формате SRT.

Если слово или имя распознано неуверенно, пометь его как [уточнить].`,
      enPrompt: `Create subtitles for this video.

Requirements:
— transcribe the speech;
— keep timestamps;
— separate speakers if there are several;
— remove obvious repetitions and filler words without changing the meaning;
— make short lines that are easy to read on screen;
— prepare the result in SRT format.

If a word or name is uncertain, mark it as [verify].`,
      warning: "Субтитры почти всегда требуют ручной вычитки: одна ошибка в термине может испортить весь фрагмент.",
      tags: ["субтитры", "SRT", "расшифровка видео", "ИИ для видео", "таймкоды"]
    })
  },
  {
    slug: "napisat-scenarij-dlya-video-cherez-nejroset",
    title: "Как написать сценарий для видео через нейросеть",
    breadcrumbTitle: "Написать сценарий для видео с помощью ИИ",
    description: "Промт превращает идею ролика в сценарий: хук, структура, кадры, реплики, b-roll, монтажные подсказки и CTA.",
    date: "2026-09-03",
    category: "Видео",
    image: "/images/posts/napisat-scenarij-dlya-video-cherez-nejroset.png",
    imageAlt: "Написание сценария для видео через нейросеть",
    bodyHtml: body({
      intro: "Сценарий для ролика лучше начинать с цели и зрителя: тогда ИИ не пишет абстрактную лекцию, а собирает понятный путь от хука к выводу.",
      image: "/images/posts/napisat-scenarij-dlya-video-cherez-nejroset.png",
      imageAlt: "Написание сценария для видео через нейросеть",
      topic: "scenarij_dlya_video",
      toolUrl: study,
      toolName: "Study24 AI",
      steps: ["Опиши тему, аудиторию и цель ролика.", "Укажи длительность и площадку: Shorts, Reels, YouTube, обучающее видео.", "Попроси несколько вариантов хука.", "Собери сценарий по блокам: кадр, текст, визуал, звук.", "Попроси убрать воду и сделать речь разговорной."],
      result: "Хороший сценарий содержит не только текст диктора, но и визуальные действия, монтажные подсказки и финальный призыв.",
      ruPrompt: `Напиши сценарий для видео.

Тема: [тема]
Аудитория: [для кого]
Цель: [что зритель должен понять или сделать]
Длительность: [30 секунд / 1 минута / 5 минут]
Площадка: [YouTube / Shorts / Reels / другое]

Сделай:
— 5 вариантов хука;
— структуру ролика;
— сценарий по блокам: кадр, текст диктора, визуал, звук;
— идеи b-roll;
— финальный призыв к действию.

Пиши живым разговорным языком, без воды и канцелярита.`,
      enPrompt: `Write a video script.

Topic: [topic]
Audience: [who it is for]
Goal: [what viewers should understand or do]
Duration: [30 seconds / 1 minute / 5 minutes]
Platform: [YouTube / Shorts / Reels / other]

Create:
— 5 hook options;
— video structure;
— block-by-block script: shot, narration, visual, sound;
— b-roll ideas;
— final call to action.

Use natural conversational language, no fluff or bureaucratic phrasing.`,
      warning: "После генерации прочитай сценарий вслух: текст, который хорошо выглядит на экране, может звучать деревянно в речи.",
      tags: ["сценарий видео", "ИИ сценарий", "YouTube сценарий", "Reels", "промт сценарий"]
    })
  },
  {
    slug: "sdelat-korotkie-klipy-iz-dlinnogo-video-s-pomoshhju-ii",
    title: "Как сделать короткие клипы из длинного видео с помощью ИИ",
    breadcrumbTitle: "Сделать короткие клипы из видео через нейросеть",
    description: "Промт помогает найти сильные моменты в длинном видео и превратить их в короткие клипы для соцсетей: хук, субтитры, кадрирование и подпись.",
    date: "2026-09-03",
    category: "Видео",
    image: "/images/posts/sdelat-korotkie-klipy-iz-dlinnogo-video-s-pomoshhju-ii.png",
    imageAlt: "Создание коротких клипов из длинного видео с помощью ИИ",
    bodyHtml: body({
      intro: "Из длинного видео редко нужно резать всё подряд: лучше найти моменты с конфликтом, пользой, эмоцией или самостоятельной мыслью.",
      image: "/images/posts/sdelat-korotkie-klipy-iz-dlinnogo-video-s-pomoshhju-ii.png",
      imageAlt: "Создание коротких клипов из длинного видео с помощью ИИ",
      topic: "korotkie_klipy_iz_video",
      toolUrl: study,
      toolName: "Study24 AI",
      steps: ["Загрузи длинное видео или расшифровку.", "Попроси найти 5-10 самостоятельных фрагментов.", "Укажи длительность клипов: 15, 30 или 60 секунд.", "Попроси хук, субтитры и описание для каждого фрагмента.", "Проверь, что мысль понятна без контекста полного ролика."],
      result: "Лучший результат — таблица с таймкодом начала и конца, темой клипа, хуком, подписью и идеей кадрирования.",
      ruPrompt: `Найди короткие клипы в этом длинном видео.

Нужно:
— выбрать 5-10 сильных фрагментов;
— для каждого указать начало и конец;
— объяснить, почему фрагмент может удержать внимание;
— предложить хук для первых 2 секунд;
— сделать короткую подпись;
— предложить формат кадрирования 9:16;
— добавить текст субтитров для клипа.

Выбирай фрагменты, которые понятны без просмотра полного видео.`,
      enPrompt: `Find short clips in this long video.

Requirements:
— choose 5-10 strong fragments;
— provide start and end timestamps for each one;
— explain why the fragment can hold attention;
— suggest a hook for the first 2 seconds;
— create a short caption;
— suggest 9:16 framing;
— add subtitle text for the clip.

Choose fragments that make sense without watching the full video.`,
      warning: "Короткий клип не должен искажать смысл полного видео. Особенно аккуратно режь спорные цитаты и экспертные выводы.",
      tags: ["короткие клипы", "нарезка видео", "Shorts", "Reels", "ИИ для видео"]
    })
  },
  {
    slug: "sozdat-prevyu-dlya-video-cherez-nejroset",
    title: "Как создать превью для видео через нейросеть",
    breadcrumbTitle: "Создать превью для видео с помощью ИИ",
    description: "Промт помогает сделать варианты обложки для видео: кадр, композиция, контраст, место под текст и честный визуальный хук.",
    date: "2026-09-03",
    category: "Видео",
    image: "/images/posts/sozdat-prevyu-dlya-video-cherez-nejroset.png",
    imageAlt: "Создание превью для видео через нейросеть",
    bodyHtml: body({
      intro: "Превью должно быстро объяснять тему ролика и не обещать того, чего в видео нет. Иначе клики будут, а доверие исчезнет.",
      image: "/images/posts/sozdat-prevyu-dlya-video-cherez-nejroset.png",
      imageAlt: "Создание превью для видео через нейросеть",
      topic: "prevyu_dlya_video",
      toolUrl: gptImage,
      toolName: "GPT Image в Study24",
      steps: ["Выбери ключевой кадр или опиши сюжет ролика.", "Укажи площадку и формат: 16:9 для YouTube, 9:16 для вертикальных видео.", "Попроси 4-6 вариантов композиции.", "Оставь место под 2-4 слова крупного текста.", "Проверь превью в маленьком размере: оно должно читаться на телефоне."],
      result: "Хорошее превью имеет один главный объект, сильный контраст и чистую область под короткую надпись.",
      ruPrompt: `Создай превью для видео.

Тема ролика: [тема]
Главная эмоция или интрига: [что должно зацепить]
Формат: 16:9
Текст на превью: [2-4 слова или оставить место без текста]

Требования:
— сделай 4 варианта композиции;
— один главный визуальный акцент;
— крупные формы и хороший контраст;
— оставь чистую область под текст;
— превью должно быть честным и соответствовать содержанию видео;
— не используй чужие логотипы и кликбейт, который искажает смысл.`,
      enPrompt: `Create a video thumbnail.

Video topic: [topic]
Main emotion or intrigue: [what should catch attention]
Format: 16:9
Thumbnail text: [2-4 words or leave space without text]

Requirements:
— create 4 composition options;
— one main visual focus;
— large shapes and strong contrast;
— keep a clean area for text;
— the thumbnail must honestly match the video content;
— do not use third-party logos or misleading clickbait.`,
      warning: "Не перегружай превью мелким текстом: на мобильном оно превращается в шум.",
      tags: ["превью видео", "обложка YouTube", "thumbnail", "ИИ дизайн", "промт превью"]
    })
  }
];

for (const post of posts) {
  await writeFile(path.join(root, "content", "posts", `${post.slug}.json`), `${JSON.stringify(post, null, 2)}\n`, "utf8");
}

console.log(`Created ${posts.length} posts`);
