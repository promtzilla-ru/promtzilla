# Promptzilla AI Handoff

Этот документ нужен для другой нейросети/ассистента, чтобы быстро подхватить проект Promptzilla без потери правил и контекста.

## Что это за проект

Promptzilla - статический HTML-сайт вместо WordPress.

Основная идея сайта: практические страницы вида "как сделать X через ИИ/нейросеть". Каждая страница должна сразу давать пользователю:

- что получится;
- что загрузить в нейросеть;
- какой инструмент использовать;
- готовый RU-промпт;
- готовый EN-промпт;
- пример результата;
- SEO-теги.

Не делать маркетинговые лендинги. Делать прикладные страницы с промптом.

## Важные правила владельца проекта

1. Пользователь - мужчина. Обращаться в мужском роде.
2. Публичные URL страниц всегда без `index.html`: `https://promtzilla.ru/<slug>/`.
3. Физически страницы собираются как `dist/<slug>/index.html`, но в ссылках, canonical, sitemap и ответах пользователю писать только `/<slug>/`.
4. При создании, удалении или переименовании страницы обязательно обновлять sitemap. Сейчас `sitemap.xml` генерируется автоматически в `scripts/build.mjs`.
5. Внутренние ссылки не должны содержать `index.html`.
6. Не возвращать WordPress-сайдбар и старую WordPress-структуру.
7. Все медиа для страниц хранить локально, не ссылаться на внешний WordPress-домен, если файл можно положить в проект.
8. Перед завершением изменений всегда запускать сборку и проверки.

## Структура проекта

- `content/posts/` - исходные JSON-файлы страниц.
- `public/` - исходные статические ассеты.
- `public/wp-content/uploads/YYYY/MM/` - локальные изображения/видео страниц.
- `public/assets/styles.css` - общие стили сайта.
- `scripts/build.mjs` - главный генератор HTML, sitemap и микроразметки.
- `scripts/check-dist-links.mjs` - проверка локальных ссылок в `dist`.
- `scripts/check-breadcrumb-titles.mjs` - проверка вариативности хлебных крошек.
- `dist/` - готовый сайт для хостинга.
- `dist/sitemap.xml` - готовая карта сайта.
- `docs/page-canon.md` - старый канон страниц, может отображаться битой кодировкой в терминале, но содержит полезные правила.
- `docs/AI_HANDOFF.md` - этот файл.

## Команды

На Windows использовать `npm.cmd`, потому что PowerShell может блокировать `npm.ps1`.

```powershell
npm.cmd run build
npm.cmd run check:links
npm.cmd run check:breadcrumbs
```

Основная проверка перед завершением:

```powershell
npm.cmd run build
npm.cmd run check:links
```

Дополнительно проверить, что в URL не осталось `index.html`:

```powershell
$matches = Select-String -Path (Get-ChildItem -Path dist -Recurse -Filter *.html).FullName -Pattern 'href=\"[^\"]*index\.html|url=[^\"]*index\.html|canonical\" href=\"[^\"]*index\.html|content=\"0; url=[^\"]*index\.html'; "URL matches with index.html: $($matches.Count)"
```

Ожидаемо: `URL matches with index.html: 0`.

## Как добавить новую страницу

1. Выбрать slug.

   Пример:

   ```text
   kak-otbelit-zuby-na-foto-cherez-ii
   ```

2. Создать JSON в `content/posts/`.

   Пример имени:

   ```text
   content/posts/teeth-whitening-ai.json
   ```

3. Минимальная структура JSON:

   ```json
   {
     "slug": "short-internal-slug",
     "legacySlug": "public-seo-slug",
     "title": "Название страницы",
     "description": "Короткое описание для meta description",
     "date": "2026-07-13",
     "category": "Фото",
     "image": "/wp-content/uploads/2026/07/file-name.png",
     "imageAlt": "Alt изображения",
     "bodyHtml": "<div class=\"pz-wrap\">...</div>"
   }
   ```

4. `legacySlug` сейчас используется как публичный путь страницы. Если он есть, страница будет собрана в:

   ```text
   dist/<legacySlug>/index.html
   ```

   Публичный URL:

   ```text
   https://promtzilla.ru/<legacySlug>/
   ```

5. В `bodyHtml` соблюдать структуру:

   - `.pz-wrap`
   - `.pz-eyebrow`
   - `.pz-title`
   - `.pz-desc`
   - `.pz-howto`
   - `.pz-steps`
   - `.pz-step`
   - `.pz-step-text`
   - `.pz-section`
   - `.pz-card`
   - `.pz-card-body`
   - `.pz-tags`

6. Обязательно 5-6 шагов в `.pz-howto`. Из них автоматически создаётся микроразметка `HowTo`.

7. Обязательно RU и EN промпты.

8. Обязательно 10 SEO-тегов внизу.

9. Картинки класть в:

   ```text
   public/wp-content/uploads/YYYY/MM/
   ```

10. Запустить:

   ```powershell
   npm.cmd run build
   npm.cmd run check:links
   ```

11. Проверить, что:

   - страница есть в `dist/<slug>/index.html`;
   - URL в sitemap без `index.html`;
   - новая карточка появилась на главной;
   - `HowTo`, `TechArticle`, `BreadcrumbList` появились автоматически.

## Микроразметка

`scripts/build.mjs` автоматически добавляет:

- `BreadcrumbList` для всех основных страниц;
- `HowTo` для страниц с `.pz-howto`;
- `TechArticle` для всех основных страниц;
- `Organization` на главную;
- `WebSite` на главную.

После сборки можно проверить JSON-LD:

```powershell
$files = Get-ChildItem -Path dist -Recurse -Filter *.html; $types = @{}; $bad = @(); foreach ($f in $files) { $html = Get-Content -LiteralPath $f.FullName -Raw; [regex]::Matches($html, '<script type=\"application/ld\+json\">([\s\S]*?)</script>') | ForEach-Object { try { $json = $_.Groups[1].Value | ConvertFrom-Json; $type = $json.'@type'; if ($type) { if (-not $types.ContainsKey($type)) { $types[$type] = 0 }; $types[$type] = $types[$type] + 1 } } catch { $bad += $f.FullName } } }; $types.GetEnumerator() | Sort-Object Name | ForEach-Object { "$($_.Name): $($_.Value)" }; "Bad JSON-LD files: $($bad.Count)"
```

`Bad JSON-LD files` должен быть `0`.

## Sitemap

Sitemap генерируется в `scripts/build.mjs` функцией `sitemapXml(posts)`.

Файл результата:

```text
dist/sitemap.xml
```

В sitemap должны быть:

- `https://promtzilla.ru/`
- `https://promtzilla.ru/o-proekte/`
- все канонические страницы из `content/posts`;
- только URL без `index.html`.

## GitHub и деплой

Репозиторий:

```text
https://github.com/rawebmaster/promtzilla
```

Локально Codex может менять файлы, но может не иметь права писать в `.git`. Если `git add` падает с `Permission denied`, пользователь должен выполнить команды сам в PowerShell:

```powershell
cd "C:\Users\ranum\OneDrive\Документы\Promptzilla"
git add .
git commit -m "Update Promptzilla site"
git push
```

На сервере сейчас нет Node/npm. Поэтому сервер не собирает проект. Он просто берёт готовую папку `dist` из GitHub.

Серверная структура:

```text
~/promtzilla.ru/htdocs/www/
~/promtzilla.ru/htdocs/www/repo/
```

Обновление сайта на сервере:

```bash
cd ~/promtzilla.ru/htdocs/www/repo
git pull
cp -r dist/* ..
```

Потом проверить:

```text
https://promtzilla.ru/
https://promtzilla.ru/sitemap.xml
```

## Важный текущий нюанс деплоя

Так как на сервере используется `cp -r dist/* ..`, старые удалённые файлы могут оставаться в `www`. Если удаляется страница, лучше чистить соответствующую папку вручную или заменить процесс деплоя на синхронизацию с удалением лишнего.

Безопасный вариант для будущего: держать `repo` вне публичной папки, а публичную `www` синхронизировать с `repo/dist`. Но сейчас рабочий процесс такой:

```bash
cd ~/promtzilla.ru/htdocs/www/repo
git pull
cp -r dist/* ..
```

## Последние важные изменения

- Исправлены URL: внутренние ссылки больше не должны содержать `index.html`.
- Добавлена генерация `dist/sitemap.xml`.
- Добавлены микроразметки `HowTo`, `TechArticle`, `BreadcrumbList`, `Organization`, `WebSite`.
- Добавлена страница:

  ```text
  https://promtzilla.ru/kak-otbelit-zuby-na-foto-cherez-ii/
  ```

## Что спрашивать у пользователя перед работой

Если задача про новую страницу, обычно можно не задавать много вопросов. Достаточно уточнить только если не хватает критичных данных:

- точная тема страницы;
- нужен ли конкретный slug;
- есть ли свои изображения.

Если изображений нет, можно создать/подготовить локальные демонстрационные визуалы и положить их в `public/wp-content/uploads/YYYY/MM/`.

## Чего не делать

- Не писать публичные ссылки с `index.html`.
- Не забывать sitemap.
- Не добавлять страницу только в `dist`, минуя `content/posts`.
- Не ссылаться на временные изображения из `.codex/generated_images`.
- Не оставлять проект без `npm.cmd run build` и `npm.cmd run check:links`.
- Не ломать существующие пользовательские изменения в рабочем дереве.
- Не удалять `.git`, не делать `git reset --hard` без явного приказа пользователя.
