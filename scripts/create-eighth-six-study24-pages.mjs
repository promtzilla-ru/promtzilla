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
    <p>${result} Для такой задачи можно открыть <a href="${ref(toolUrl, topic)}" rel="sponsored noopener" target="_blank">${toolName}</a>, дать вводные и попросить несколько вариантов под разные цели.</p>
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
    slug: "sozdat-avatar-dlya-socsetej-s-pomoshhju-ii",
    title: "Как создать аватар для соцсетей с помощью ИИ",
    breadcrumbTitle: "Создать аватар для соцсетей через нейросеть",
    description: "Промт помогает превратить обычное фото в набор аватаров для соцсетей: деловой, дружелюбный, минималистичный и творческий стиль.",
    date: "2026-09-05",
    category: "Соцсети",
    image: "/images/posts/sozdat-avatar-dlya-socsetej-s-pomoshhju-ii.png",
    imageAlt: "Создание аватара для соцсетей с помощью ИИ",
    bodyHtml: body({
      intro: "Аватар должен оставаться похожим на человека, но подстраиваться под площадку: деловой профиль, личный блог, экспертная страница или творческий аккаунт.",
      image: "/images/posts/sozdat-avatar-dlya-socsetej-s-pomoshhju-ii.png",
      imageAlt: "Создание аватара для соцсетей с помощью ИИ",
      topic: "avatar_dlya_socsetej",
      toolUrl: gptImage,
      toolName: "GPT Image в Study24",
      steps: ["Выбери чёткое фото лица без сильной тени и фильтров.", "Определи, где будет использоваться аватар: Telegram, блог, резюме, экспертный профиль.", "Попроси сохранить узнаваемость лица и сделать несколько стилей.", "Проверь, как аватар выглядит маленьким кружком.", "Выбери вариант без лишних деталей и странной ретуши."],
      result: "Хороший результат — несколько вариантов одного и того же человека, где меняется фон, настроение и стилистика, но не внешность.",
      ruPrompt: `Создай аватар для соцсетей по этому фото.

Нужно:
— сохранить узнаваемость лица, возраст, черты и естественную мимику;
— сделать 6 вариантов: деловой, дружелюбный, минималистичный, экспертный, творческий и иллюстрированный;
— заменить фон на чистый и аккуратный;
— улучшить свет без пластиковой ретуши;
— кадрировать так, чтобы аватар хорошо читался в круге.

Не меняй форму лица, цвет глаз, причёску и важные особенности внешности.`,
      enPrompt: `Create social media avatars from this photo.

Requirements:
— preserve face recognizability, age, features, and natural expression;
— create 6 versions: professional, friendly, minimal, expert, creator, and illustrated;
— replace the background with a clean one;
— improve lighting without plastic retouching;
— crop so the avatar works well in a circle.

Do not change face shape, eye color, hairstyle, or important appearance details.`,
      warning: "Не используй аватар, если нейросеть сильно изменила лицо: это снижает доверие к профилю.",
      tags: ["аватар", "соцсети", "ИИ аватар", "фото профиля", "промт аватар"]
    })
  },
  {
    slug: "napisat-rezyume-cherez-nejroset",
    title: "Как написать резюме через нейросеть",
    breadcrumbTitle: "Написать резюме с помощью ИИ",
    description: "Промт помогает собрать резюме из опыта, навыков и достижений: структура, сильное summary, измеримые результаты и адаптация под вакансию.",
    date: "2026-09-05",
    category: "Работа",
    image: "/images/posts/napisat-rezyume-cherez-nejroset.png",
    imageAlt: "Написание резюме через нейросеть",
    bodyHtml: body({
      intro: "Резюме становится сильнее, когда ИИ не просто переписывает опыт красивыми словами, а вытаскивает измеримые результаты и подгоняет акценты под вакансию.",
      image: "/images/posts/napisat-rezyume-cherez-nejroset.png",
      imageAlt: "Написание резюме через нейросеть",
      topic: "napisat_rezyume",
      toolUrl: study,
      toolName: "Study24 AI",
      steps: ["Собери опыт, проекты, навыки и достижения в сыром виде.", "Добавь текст вакансии, под которую нужно адаптировать резюме.", "Попроси ИИ найти сильные факты и убрать общие фразы.", "Сделай версию на одну страницу и расширенную версию.", "Проверь, что все цифры и факты правдивые."],
      result: "Нужен не универсальный шаблон, а резюме под конкретную роль: с правильными ключевыми словами и доказательствами результата.",
      ruPrompt: `Помоги написать сильное резюме.

Мой опыт:
[вставь опыт, проекты, навыки, образование]

Вакансия:
[вставь описание вакансии]

Сделай:
— профессиональное summary на 3-4 строки;
— блок навыков под вакансию;
— описание опыта через достижения и цифры;
— список слабых мест, которые стоит уточнить;
— версию резюме на одну страницу.

Не выдумывай опыт, компании, должности и цифры. Если данных не хватает, задай уточняющие вопросы.`,
      enPrompt: `Help me write a strong resume.

My experience:
[paste experience, projects, skills, education]

Job posting:
[paste job description]

Create:
— a professional 3-4 line summary;
— skills section tailored to the job;
— experience descriptions focused on achievements and metrics;
— weak points that need clarification;
— a one-page resume version.

Do not invent experience, companies, job titles, or numbers. If information is missing, ask clarifying questions.`,
      warning: "ИИ может красиво сформулировать лишнее. Всё, что выглядит как факт, должно быть правдой и подтверждаться твоим опытом.",
      tags: ["резюме", "работа", "карьера", "нейросеть текст", "промт резюме"]
    })
  },
  {
    slug: "napisat-soprovoditelnoe-pismo-s-pomoshhju-ii",
    title: "Как написать сопроводительное письмо с помощью ИИ",
    breadcrumbTitle: "Написать сопроводительное письмо через нейросеть",
    description: "Промт помогает написать письмо под вакансию: показать мотивацию, совпадение опыта, пользу для компании и живой тон без шаблонности.",
    date: "2026-09-05",
    category: "Работа",
    image: "/images/posts/napisat-soprovoditelnoe-pismo-s-pomoshhju-ii.png",
    imageAlt: "Написание сопроводительного письма с помощью ИИ",
    bodyHtml: body({
      intro: "Сопроводительное письмо должно объяснять, почему ты подходишь именно этой вакансии, а не повторять резюме другими словами.",
      image: "/images/posts/napisat-soprovoditelnoe-pismo-s-pomoshhju-ii.png",
      imageAlt: "Написание сопроводительного письма с помощью ИИ",
      topic: "soprovoditelnoe_pismo",
      toolUrl: study,
      toolName: "Study24 AI",
      steps: ["Вставь описание вакансии и своё резюме.", "Укажи тон: спокойный, уверенный, без канцелярита.", "Попроси связать требования вакансии с твоим опытом.", "Сделай письмо коротким: 3-5 абзацев.", "Проверь, что письмо звучит как ты, а не как шаблон."],
      result: "Хорошее письмо коротко показывает мотивацию, совпадение опыта и конкретную пользу для работодателя.",
      ruPrompt: `Напиши сопроводительное письмо под вакансию.

Вакансия:
[вставь вакансию]

Мой опыт:
[вставь резюме или ключевые факты]

Требования:
— 3-5 коротких абзацев;
— живой уверенный тон без штампов;
— объяснить, почему мне интересна эта роль;
— связать мой опыт с требованиями вакансии;
— показать, какую пользу я могу принести;
— не повторять резюме полностью.

Не выдумывай факты. Если данных мало, предложи 3 вопроса, которые помогут улучшить письмо.`,
      enPrompt: `Write a cover letter for this job.

Job posting:
[paste job posting]

My experience:
[paste resume or key facts]

Requirements:
— 3-5 short paragraphs;
— natural confident tone without clichés;
— explain why I am interested in this role;
— connect my experience to the job requirements;
— show what value I can bring;
— do not repeat the whole resume.

Do not invent facts. If information is missing, suggest 3 questions that would improve the letter.`,
      warning: "Перед отправкой убери фразы, которые не похожи на твою речь. Письмо должно звучать лично.",
      tags: ["сопроводительное письмо", "поиск работы", "карьера", "ИИ текст", "промт письмо"]
    })
  },
  {
    slug: "napisat-post-dlya-socsetej-cherez-nejroset",
    title: "Как написать пост для соцсетей через нейросеть",
    breadcrumbTitle: "Написать пост для соцсетей с помощью ИИ",
    description: "Промт помогает превратить тему в пост: хук, структура, тон, польза, сторителлинг, CTA и варианты для разных площадок.",
    date: "2026-09-05",
    category: "Соцсети",
    image: "/images/posts/napisat-post-dlya-socsetej-cherez-nejroset.png",
    imageAlt: "Написание поста для соцсетей через нейросеть",
    bodyHtml: body({
      intro: "Пост получается лучше, когда ИИ знает аудиторию, цель и площадку. Один и тот же текст для Telegram, VK и короткого Reels-подписания работает по-разному.",
      image: "/images/posts/napisat-post-dlya-socsetej-cherez-nejroset.png",
      imageAlt: "Написание поста для соцсетей через нейросеть",
      topic: "post_dlya_socsetej",
      toolUrl: study,
      toolName: "Study24 AI",
      steps: ["Опиши тему и аудиторию.", "Укажи площадку и цель: вовлечение, продажа, экспертность, анонс.", "Попроси 5 вариантов хука.", "Собери структуру: начало, польза, пример, вывод, CTA.", "Попроси сделать несколько версий разной длины."],
      result: "Нужен не один текст, а набор вариантов: экспертный, продающий, сторителлинг и короткий анонс.",
      ruPrompt: `Напиши пост для соцсетей.

Тема: [тема]
Аудитория: [кто читает]
Площадка: [Telegram / VK / Instagram / другое]
Цель поста: [вовлечение / продажа / экспертность / анонс]
Тон: [спокойный / дерзкий / экспертный / дружелюбный]

Сделай:
— 5 вариантов хука;
— основной пост;
— короткую версию;
— CTA;
— 5 вариантов заголовка;
— идеи для картинки или карусели.

Пиши живо, без воды, клише и слишком рекламного тона.`,
      enPrompt: `Write a social media post.

Topic: [topic]
Audience: [readers]
Platform: [Telegram / VK / Instagram / other]
Goal: [engagement / sales / expertise / announcement]
Tone: [calm / bold / expert / friendly]

Create:
— 5 hook options;
— main post;
— short version;
— call to action;
— 5 headline options;
— ideas for an image or carousel.

Write naturally, with no fluff, clichés, or overly promotional tone.`,
      warning: "После генерации проверь факты и убери универсальные фразы: они делают пост похожим на массу других ИИ-текстов.",
      tags: ["пост для соцсетей", "контент", "SMM", "нейросеть текст", "промт пост"]
    })
  },
  {
    slug: "sozdat-opisanie-tovara-po-tekstu-s-pomoshhju-ii",
    title: "Как создать описание товара по тексту с помощью ИИ",
    breadcrumbTitle: "Создать описание товара по тексту через нейросеть",
    description: "Промт превращает характеристики товара в продающее описание: выгоды, свойства, SEO-блок, таблицу параметров и честные ограничения.",
    date: "2026-09-05",
    category: "Маркетплейсы",
    image: "/images/posts/sozdat-opisanie-tovara-po-tekstu-s-pomoshhju-ii.png",
    imageAlt: "Создание описания товара по тексту с помощью ИИ",
    bodyHtml: body({
      intro: "Хорошее описание товара переводит характеристики на язык пользы: не просто «20 литров», а кому и зачем это удобно.",
      image: "/images/posts/sozdat-opisanie-tovara-po-tekstu-s-pomoshhju-ii.png",
      imageAlt: "Создание описания товара по тексту с помощью ИИ",
      topic: "opisanie_tovara_po_tekstu",
      toolUrl: study,
      toolName: "Study24 AI",
      steps: ["Собери характеристики, материалы, размеры и комплектацию.", "Опиши аудиторию и площадку продажи.", "Попроси разделить свойства и выгоды.", "Сделай SEO-описание, короткие буллеты и таблицу параметров.", "Проверь, что ИИ не добавил несуществующие функции."],
      result: "Хороший результат содержит короткое описание, выгоды, характеристики, SEO-фразы и честные ограничения товара.",
      ruPrompt: `Создай описание товара по этим данным.

Товар:
[название или тип товара]

Характеристики:
[размер, материал, цвет, функции, комплектация]

Аудитория:
[для кого товар]

Нужно:
— короткое описание на 2-3 предложения;
— 7 продающих буллетов через выгоды;
— таблица характеристик;
— SEO-описание для карточки;
— варианты заголовка;
— что нельзя обещать, если этого нет в характеристиках.

Не выдумывай свойства, сертификаты, гарантию и совместимость.`,
      enPrompt: `Create a product description from this data.

Product:
[product name or type]

Specifications:
[size, material, color, functions, package contents]

Audience:
[who it is for]

Create:
— a short 2-3 sentence description;
— 7 benefit-driven selling bullets;
— specifications table;
— SEO description for a product card;
— title options;
— claims that should not be made unless present in the specs.

Do not invent features, certificates, warranty, or compatibility.`,
      warning: "На маркетплейсах опасно выдумывать свойства товара: это приводит к возвратам и жалобам.",
      tags: ["описание товара", "маркетплейс", "SEO описание", "карточка товара", "ИИ текст"]
    })
  },
  {
    slug: "napisat-email-rassylku-cherez-nejroset",
    title: "Как написать email-рассылку через нейросеть",
    breadcrumbTitle: "Написать email-рассылку с помощью ИИ",
    description: "Промт помогает собрать email-цепочку: тема письма, сегменты аудитории, структура, оффер, CTA, A/B варианты и антиспам-тон.",
    date: "2026-09-05",
    category: "Маркетинг",
    image: "/images/posts/napisat-email-rassylku-cherez-nejroset.png",
    imageAlt: "Написание email-рассылки через нейросеть",
    bodyHtml: body({
      intro: "Рассылка работает лучше, когда письмо пишется под сегмент и цель: прогрев, возвращение клиента, продажа, анонс или обучение.",
      image: "/images/posts/napisat-email-rassylku-cherez-nejroset.png",
      imageAlt: "Написание email-рассылки через нейросеть",
      topic: "email_rassylka",
      toolUrl: study,
      toolName: "Study24 AI",
      steps: ["Определи цель рассылки и сегмент аудитории.", "Сформулируй оффер и ограничение по тону.", "Попроси тему, прехедер, тело письма и CTA.", "Сделай A/B варианты темы и первого экрана.", "Проверь письмо на спамность, обещания и чрезмерное давление."],
      result: "Нужна не просто «продающая рассылка», а цепочка писем с логикой: знакомство, польза, доверие, оффер и следующий шаг.",
      ruPrompt: `Напиши email-рассылку.

Цель: [продажа / прогрев / возвращение / анонс / обучение]
Аудитория: [сегмент]
Оффер: [что предлагаем]
Тон: [дружелюбный / экспертный / спокойный / срочный]

Сделай:
— 5 тем письма;
— 5 прехедеров;
— основное письмо;
— короткую версию;
— CTA;
— A/B вариант первого экрана;
— список фраз, которые лучше убрать, чтобы письмо не выглядело спамным.

Пиши ясно, без давления и пустых обещаний.`,
      enPrompt: `Write an email newsletter.

Goal: [sales / nurture / win-back / announcement / education]
Audience: [segment]
Offer: [what we offer]
Tone: [friendly / expert / calm / urgent]

Create:
— 5 subject lines;
— 5 preheaders;
— main email;
— short version;
— call to action;
— A/B version of the opening screen;
— phrases to remove so the email does not feel spammy.

Write clearly, without pressure or empty promises.`,
      warning: "Рассылку нужно адаптировать под законные согласия и правила платформы: ИИ не проверяет юридическую сторону отправки.",
      tags: ["email рассылка", "маркетинг", "письмо клиентам", "нейросеть текст", "промт email"]
    })
  }
];

for (const post of posts) {
  await writeFile(path.join(root, "content", "posts", `${post.slug}.json`), `${JSON.stringify(post, null, 2)}\n`, "utf8");
}

console.log(`Created ${posts.length} posts`);
