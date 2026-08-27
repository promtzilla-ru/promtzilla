# Changelly: гипотезы роста мобильного небрендового SEO-трафика

## Вводные

Задача: предложить до 5 гипотез роста **мобильного небрендового SEO-трафика** для changelly.com. ASO, брендовый трафик и платные каналы не рассматриваю.

Changelly - криптообменник и on/off-ramp сервис. Пользователь может обменивать криптовалюты, покупать крипту за фиат и продавать ее через сайт. Поэтому приоритет в SEO я отдаю страницам с транзакционным intent: `buy`, `exchange`, `swap`, `convert`, а не общему информационному блогу.

Анализ сделан на основе:

- главной страницы Changelly;
- programmatic SEO-страниц `/buy/{coin}`, `/buy/{coin}/{country}`, `/exchange/{from}/{to}`;
- исходного HTML, canonical, hreflang, meta-тегов и JSON-LD;
- сравнения с конкурентами ChangeNOW и SimpleSwap.

## Методология приоритизации

Использую ICE/RICE-lite модель, адаптированную под SEO.

Оцениваю каждую гипотезу по 4 критериям:

| Критерий | Что означает | Шкала |
|---|---|---:|
| Impact | Потенциальное влияние на mobile non-brand organic traffic и бизнес | 1-5 |
| Confidence | Насколько уверенно подтверждена проблема: HTML, конкуренты, спрос, логика продукта | 1-5 |
| Business proximity | Насколько запрос близок к транзакции: buy/exchange выше, blog ниже | 1-5 |
| Effort | Сложность реализации: разработка, контент, аналитика, QA | 1-5, где 5 = сложно |

Формула:

```text
Priority score = (Impact x Confidence x Business proximity) / Effort
```

Score использую как ориентир, но финальный порядок запуска делю на два типа задач:

- **quick wins / risk fixes** - быстрые исправления, которые можно запускать сразу, даже если они сами по себе не создают новый кластер спроса;
- **growth bets** - гипотезы, которые создают или расширяют посадочные страницы под небрендовый коммерческий спрос.

При равном score выше ставлю гипотезы, которые работают с коммерческими страницами и могут быстрее привести к start exchange / start buy / transaction created.

## Сводная таблица гипотез

| Приоритет | Тип | Гипотеза | Impact | Confidence | Business proximity | Effort | Score |
|---:|---|---|---:|---:|---:|---:|---:|
| P1 | Growth bet | Network-specific страницы для USDT/USDC | 5 | 5 | 5 | 4 | 31.3 |
| P1 | Quick win | Data-quality аудит programmatic-шаблонов | 4 | 5 | 4 | 2 | 40.0 |
| P2 | Growth bet | Локальные payment-method страницы | 4 | 4 | 5 | 3 | 26.7 |
| P2 | Technical/risk fix | Technical SEO & mobile UX hygiene | 4 | 5 | 3 | 3 | 20.0 |

Важно: data-quality фикс получает самый высокий score из-за низкого effort, поэтому его нужно запускать в первую неделю. Но как главную **growth-гипотезу** я выделяю network-specific страницы: они создают новый масштабируемый кластер небрендового спроса, а не только чинят уже существующие ошибки.

---

## Гипотеза 1. Network-specific страницы для USDT/USDC

**Что обнаружено**

На странице `changelly.com/exchange/btc/usdt` общий запрос `BTC to USDT` раскрывается через `Tether OMNI`.

Проблемы:

- Omni - устаревшая сеть USDT, сейчас пользователь чаще ожидает TRC20, ERC20, BEP20, TON, Solana, Polygon и т.д.
- В FAQ перепутано направление пары: на странице BTC -> USDT ответ объясняет, сколько Bitcoin пользователь получит при обмене Tether.
- В HowTo и WebPage schema тоже используется `Tether OMNI`, хотя страница таргетит общий `BTC to USDT`.

**Гипотеза**

Если сделать отдельные SEO-страницы под сети стейблкоинов, Changelly сможет собрать больше мобильного long-tail трафика и повысить конверсию, потому что страница будет точнее отвечать пользовательскому intent.

**Что сделать**

- Общую страницу `/exchange/btc/usdt` превратить в хаб выбора сети USDT.
- Создать/доработать страницы:
  - `BTC to USDT TRC20`
  - `BTC to USDT ERC20`
  - `BTC to USDT BEP20`
  - `BTC to USDT TON`
  - `BTC to USDT Solana`
  - `BTC to USDT Polygon`
- Аналогично масштабировать на ETH/SOL/USDC и самые популярные пары.
- Добавить блок `Other USDT networks`.
- Исправить FAQ, HowTo и schema с учетом направления пары.
- Добавить предупреждения про выбор правильной сети, network fee и supported wallets.
- Добавить поддерживающий how-to контент вокруг кластера: `USDT TRC20 vs ERC20`, `how to choose USDT network`, `how to exchange BTC to USDT TRC20`. Эти материалы должны перелинковываться на транзакционные страницы, а не жить отдельно как блог ради блога.

**Почему в приоритете**

Это высокоинтентный коммерческий спрос. Пользователь ищет не абстрактную информацию, а конкретный обмен перед отправкой средств, часто с телефона и из мобильного кошелька.

Конкуренты уже используют этот паттерн:

- ChangeNOW делает страницы вида `/currencies/bitcoin/tether-trc20`.
- SimpleSwap показывает cross-chain options для USDT по сетям.

**Метрики**

- Mobile non-brand impressions/clicks по запросам `btc to usdt trc20`, `btc to usdt erc20`, `swap btc to usdt tron`.
- CTR и average position в GSC.
- Mobile organic sessions на network-specific страницах.
- Start exchange из mobile organic.
- Transaction created / completed transaction.
- Ошибки выбора сети или адреса в exchange-flow.

**Срок и команда**

- SEO: 1-2 недели на семантику, структуру URL и ТЗ.
- Content: 1-2 недели на FAQ/HowTo под сети.
- Product + frontend + backend/data: 3-6 недель на шаблоны, выбор сети, перелинковку.
- Analyst + QA: 1 неделя на события, дашборд и проверку.

---

## Гипотеза 2. Data-quality аудит programmatic SEO-шаблонов

**Что обнаружено**

На странице `changelly.com/buy/btc/ie` в title используется устаревшая валюта `IEP` для Ирландии. Сейчас в Ирландии используется `EUR`.

Также на exchange-странице BTC -> USDT используется `Tether OMNI`, хотя Omni для USDT уже фактически legacy-сеть.

Это похоже не на разовую опечатку, а на проблему в справочниках/маппинге, которые используются для генерации title, H1, description, FAQ и JSON-LD.

**Гипотеза**

Если исправить ошибки в данных programmatic-шаблонов, можно повысить доверие, CTR и конверсию мобильного SEO-трафика, а также снизить риск того, что масштабные страницы будут выглядеть для Google как низкокачественный шаблонный контент.

**Что сделать**

- Провести аудит справочников:
  - `country -> current fiat currency`
  - `asset -> current network/protocol`
  - `payment method -> supported country`
  - `coin/pair -> correct direction in FAQ`
- В первую очередь проверить страны еврозоны:
  - Ireland: `IEP -> EUR`
  - Croatia: `HRK -> EUR`
  - Bulgaria: `BGN -> EUR` с 2026 года
  - Lithuania: `LTL -> EUR`
  - Latvia: `LVL -> EUR`
  - Estonia: `EEK -> EUR`
  - Slovakia: `SKK -> EUR`
  - Slovenia: `SIT -> EUR`
  - Malta: `MTL -> EUR`
  - Cyprus: `CYP -> EUR`
- Проверить не только title/H1, но и description, FAQ, schema, breadcrumbs, виджет.
- Исправить источник данных, а не отдельные URL вручную.

**Почему в приоритете**

Это уже найденная конкретная проблема на коммерческой SEO-странице. Исправление относительно быстрое, а эффект масштабируется на весь programmatic-кластер.

**Метрики**

- Количество найденных и исправленных data-quality ошибок.
- Mobile CTR по исправленным URL.
- Mobile non-brand clicks на `/buy/{coin}/{country}`.
- Позиции по запросам `buy BTC in {country}`, `buy Bitcoin with {currency}`.
- Start buy из mobile organic.
- Engagement rate / bounce rate на исправленных страницах.
- Валидность rich results / structured data.

**Срок и команда**

- SEO: 3-5 дней на выборочный аудит и список проблем.
- Backend/data: 1-2 недели на исправление справочников.
- Content/localization: 1-2 недели, если нужны текстовые правки.
- QA: 3-5 дней на проверку шаблонов.

---

## Гипотеза 3. Локальные payment-method страницы

**Что обнаружено**

У Changelly уже есть programmatic-страницы под покупку крипты и глобальные способы оплаты: карты, Apple Pay, Google Pay, PayPal и т.д. Поэтому не нужно предлагать "создать Apple Pay pages" с нуля.

Незакрытая зона - локальные mobile-first способы оплаты в отдельных странах. Это другой кластер спроса: пользователь ищет не просто `buy BTC with card`, а привычный для своего рынка мобильный платежный метод.

Примеры:

- India: UPI
- Kenya: M-Pesa
- Philippines: GCash
- Pakistan: Easypaisa / JazzCash
- Brazil: Pix

**Гипотеза**

Если расширить уже существующий шаблон `/buy/{coin}/{payment-method}` и `/buy/{coin}/{country}` на локальные способы оплаты, можно получить новый мобильный небрендовый трафик с высоким intent, не дублируя уже существующие Apple Pay / Google Pay / PayPal страницы.

**Что сделать**

- Сначала проверить с продуктом/провайдерами, какие методы реально доступны.
- Не создавать страницы под неподдерживаемые методы.
- Для подтвержденных методов сделать страницы:
  - `buy USDT with UPI`
  - `buy BTC with UPI in India`
  - `buy USDT with M-Pesa in Kenya`
  - `buy BTC with GCash in Philippines`
  - `buy USDT with Pix in Brazil`
- Добавить локальные FAQ:
  - minimum amount
  - fees
  - verification
  - supported cards/wallets
  - delivery time
- Встроить buy-widget и повторный CTA ниже по странице.

**Почему в приоритете**

Это коммерческие запросы. Пользователь уже хочет купить крипту и указывает способ оплаты. На мобильных рынках платежный метод часто является главным модификатором запроса.

**Метрики**

- Mobile impressions/clicks по payment-method запросам.
- CTR по новым title/description.
- Позиции по `buy {coin} with {payment method}`.
- Start buy из mobile organic.
- Provider selected.
- Transaction created / completed.
- Revenue или gross margin from mobile organic, если доступно.

**Срок и команда**

- SEO: 1 неделя на семантику и приоритизацию стран/методов.
- Product: 1 неделя на проверку поддержки методов оплаты.
- Content/localization: 2-3 недели на первые страницы.
- Frontend/backend: 2-4 недели на шаблонные блоки и связку с провайдерами.
- Analyst + QA: 1 неделя.

---

## Гипотеза 4. Technical SEO & mobile UX hygiene для programmatic-страниц

**Что обнаружено**

На сайте есть несколько технических проблем, которые могут мешать мобильному SEO не как отдельный контентный кластер, а как инфраструктурный риск для всего programmatic SEO:

- много 301-редиректов и потенциальных редирект-цепочек;
- ошибочные/несуществующие URL могут отдавать 403 вместо корректных 404/410;
- возможны canonical/hreflang на URL с не-200 статусом;
- на мобильных страницах используется полноэкранный app-promo interstitial, который перекрывает контент;
- на проверенных страницах встречается viewport с `maximum-scale=1.0, user-scalable=0`, что блокирует pinch-to-zoom.

**Гипотеза**

Если привести технические сигналы programmatic-страниц в порядок - HTTP-статусы, редиректы, canonical, hreflang, mobile interstitial и viewport - Google будет эффективнее обходить и индексировать полезные мобильные посадочные, а пользователи из organic search будут реже сталкиваться с фрикцией на первом экране.

**Что сделать**

- Просканировать ключевые шаблоны: `/buy/{coin}`, `/buy/{coin}/{country}`, `/exchange/{from}/{to}`, локали и будущие network-specific страницы.
- Исправить внутренние ссылки, которые ведут на 301, 403, 404 или цепочки редиректов.
- Для несуществующих страниц отдавать `404` или `410`, а не `403`.
- Оставить `403` только для страниц, которые реально существуют, но закрыты по доступу.
- Проверить, что canonical и hreflang ведут только на индексируемые `200 OK` URL.
- Заменить полноэкранный app interstitial для organic users на компактный smart/app banner.
- Убрать запрет масштабирования: `user-scalable=0` и жесткий `maximum-scale=1.0`.

**Почему в приоритете**

Это не создает новый кластер спроса, как network-specific страницы, но защищает масштабирование всего programmatic SEO. Если на сайте много редиректов, неверных 4xx-статусов или hreflang/canonical на проблемные URL, Google будет хуже обходить и интерпретировать большие шаблонные разделы.

**Метрики**

- Количество 3xx/4xx/5xx URL в крауле.
- Доля внутренних ссылок на 301/403/404.
- Количество редирект-цепочек.
- Количество canonical/hreflang URL с не-200 статусом.
- Indexed pages / Discovered currently not indexed в GSC.
- Crawl stats в GSC.
- Mobile organic engagement rate.
- Start exchange / start buy из mobile organic.
- Core Web Vitals / Lighthouse mobile diagnostics.

**Срок и команда**

- SEO: 3-5 дней на краул, сегментацию проблем и ТЗ.
- Frontend/backend: 1-3 недели на исправление редиректов, статусов, canonical/hreflang, interstitial и viewport.
- Product/mobile: 3-5 дней на согласование smart banner.
- Analyst + QA: 1 неделя на события, проверку статусов и контрольный краул.

---

## Итоговый порядок запуска

```text
Неделя 1
- SEO-аудит exchange/buy шаблонов
- Технический краул: 3xx/4xx/5xx, canonical, hreflang, internal links
- Проверка справочников country/currency/network
- Быстрый data-quality фикс: IEP -> EUR и аналогичные ошибки
- ТЗ на network-specific USDT/USDC pages
- Быстрый фикс viewport

Неделя 2
- Продолжение data-quality фиксов на уровне справочников
- Исправление 403 вместо 404/410 и критичных 301-цепочек
- Замена app interstitial на smart/app banner для organic users
- Финализация структуры URL и шаблонов под сети

Недели 3-4
- Запуск первых network-specific страниц: BTC -> USDT TRC20/ERC20/BEP20/TON
- Исправление FAQ/HowTo/schema по направлению пары
- Добавление блока Other networks

Недели 4-5
- Расширение на ETH/SOL/USDC
- Запуск первых payment-method страниц после проверки поддержки провайдерами
- Перелинковка buy/exchange/fiat/network страниц

Неделя 6
- Проверка индексации
- Снятие первых данных GSC
- QA мобильного flow
- Решение, какие шаблоны масштабировать дальше
```

## Общие метрики успеха

**SEO**

- Рост mobile non-brand impressions.
- Рост mobile non-brand clicks.
- CTR по обновленным title/description.
- Average position по кластерам:
  - `btc to usdt trc20`
  - `buy btc with apple pay`
  - `buy usdt with {payment method}`
  - `buy btc in {country}`
- Количество проиндексированных network/payment/country страниц.

**Продуктовые метрики**

- Start exchange из mobile organic.
- Start buy из mobile organic.
- Provider selected.
- Transaction created.
- Completed transactions.
- Revenue / gross margin from mobile organic, если доступно.

**Качество и техника**

- Количество исправленных data-quality ошибок.
- Количество 3xx/4xx/5xx URL в крауле.
- Доля внутренних ссылок на редиректы и ошибочные URL.
- Валидность structured data.
- Валидность canonical/hreflang.
- Core Web Vitals mobile: LCP, INP, CLS.
- Lighthouse/PageSpeed mobile diagnostics.
- Ошибки виджета покупки/обмена.
- Ошибки выбора сети/адреса.

## Команда

Минимальная команда:

- SEO-специалист: аудит, семантика, ТЗ, приоритеты, контроль индексации.
- Product manager: логика сетей, платежных методов, app-promo.
- Frontend developer: шаблоны, баннеры, CTA, перелинковка.
- Backend/data engineer: справочники валют, стран, сетей, платежных методов.
- Content/localization specialist: FAQ, HowTo, локальные тексты.
- Analyst: события, GSC/GA4 дашборды, оценка эффекта.
- QA: mobile UX, canonical, hreflang, schema, виджеты.

## Короткий вывод

Главный рост мобильного небрендового SEO-трафика для Changelly я бы искал не в ASO и не в общем блоге, а в улучшении существующих programmatic SEO-шаблонов.

Самые сильные направления:

1. Закрыть network-specific спрос по USDT/USDC.
2. Исправить data-quality ошибки вроде `IEP` и `Tether OMNI`.
3. Расширить buy-страницы под payment-method и локальные mobile-first способы оплаты.
4. Привести техническую базу programmatic SEO в порядок: 301, 403/404, canonical, hreflang, interstitial и viewport.

Такой порядок дает баланс: быстрые технические фиксы в первые 1-2 недели и параллельный запуск более крупных SEO-кластеров, которые могут дать рост на горизонте 2-3 месяцев.
