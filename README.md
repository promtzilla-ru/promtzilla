# Promptzilla Static

Лёгкая HTML-версия сайта без WordPress, базы данных и обязательной CMS на проде.

## Команды

```bash
npm run build
npm run serve
```

Готовый сайт собирается в `dist`.

## Структура

- `content/posts` — статьи в JSON.
- `public/images/posts` — обложки и изображения статей.
- `public/assets/styles.css` — стили сайта.
- `scripts/build.mjs` — генератор HTML.
- `dist` — готовая версия для хостинга.

## Деплой без Cloudflare

### Вариант A: GitHub + VPS

На сервере:

```bash
git clone git@github.com:USER/REPO.git /var/www/promtzilla
cd /var/www/promtzilla
npm run build
```

Nginx должен отдавать папку:

```nginx
root /var/www/promtzilla/dist;
index index.html;
```

Обновление:

```bash
cd /var/www/promtzilla
git pull
npm run build
```

### Вариант B: GitHub + обычный хостинг с SSH

Если хостинг умеет SSH и Git:

```bash
git pull
npm run build
```

Если Node.js на хостинге нет, сайт можно собирать локально и заливать только содержимое `dist`.

## Контент-процесс

1. Добавить JSON статьи в `content/posts`.
2. Сгенерировать изображение и сохранить его в `public/images/posts`.
3. Выполнить `npm run build`.
4. Отправить изменения в Git.
5. Обновить сайт на сервере.
