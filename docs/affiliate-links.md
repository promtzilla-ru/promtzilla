# Реферальные ссылки Study AI

## Паттерн

Все внешние ссылки на Study AI ведём через `eduforms.ru`:

```text
https://eduforms.ru?rid=adeaad5a9be53cc5&erid=2SDnjcsXiW6&ulp=<encoded-target-url>&subid=promtzilla&subid2=<topic_theme>
```

Поля:

- `rid`: постоянный идентификатор партнёрки `adeaad5a9be53cc5`.
- `erid`: постоянный рекламный идентификатор `2SDnjcsXiW6`.
- `ulp`: URL целевой страницы Study AI, закодированный через `encodeURIComponent`.
- `subid`: постоянное значение `promtzilla`.
- `subid2`: короткая тема страницы, где стоит ссылка.

Примеры `subid2`:

- страница про удаление фона: `udalit_fon_s_foto`
- страница про похудение на фото: `pohudet_na_foto`
- страница про открытку ко дню рождения: `otkrytka_den_rozhdeniya`

## Генератор

```bash
node scripts/affiliate-link.mjs https://study24.ai/chat/gpt_image "udalit fon s foto"
```

## SEO-правило

Партнёрские ссылки вставлять как коммерческие:

```html
<a href="https://eduforms.ru/?rid=adeaad5a9be53cc5&erid=2SDnjcsXiW6&ulp=https%3A%2F%2Fstudy24.ai%2Fchat%2Fgpt_image&subid=promtzilla&subid2=udalit_fon_s_foto" rel="sponsored noopener" target="_blank">Открыть GPT Image 2</a>
```

`rel="sponsored"` нужен для прозрачной разметки рекламных и партнёрских ссылок. `noopener` добавляем для безопасности при `target="_blank"`.

Если нужен красивый внутренний URL, можно использовать редирект вида `/go/study-ai.php?...`, но он не заменяет `rel="sponsored"` на самой ссылке и не должен использоваться для маскировки коммерческой природы ссылки.
