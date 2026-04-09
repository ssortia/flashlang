# Web: страница тренировки (флеш-карточки) — issue #14

## Overview

Реализовать страницу тренировки слов в режиме флеш-карточек по адресу `/training`.

**Проблема:** Пользователь накопил словарь, но не может тренировать слова — страница тренировки отсутствует.

**Ключевые возможности:**

- Стартовый экран: выбор набора слов или «Все слова», общее кол-во слов в наборе
- Экран тренировки: карточка слово → перевод, кнопки «Знаю» / «Не знаю», прогресс-бар
- Экран завершения: итоги сессии, кнопки «Повторить» и «В словарь»

**Интеграция:** Использует существующие API `/training/words` (GET), `/training/result` (POST) и `/word-sets` (GET).

## Context (from discovery)

- **Существующие API:**
  - `GET /training/words?setId=&limit=` → `TrainingWord[]` (слова с `knowledgeLevel < 5`)
  - `POST /training/result` → `{ wordId, correct }` → обновлённый `TrainingWord`
  - `GET /word-sets` → `WordSet[]` (для выбора набора на стартовом экране)
- **Существующие файлы:**
  - `apps/web/src/api/word-sets.api.ts` — уже существует, переиспользуем
  - `apps/web/src/hooks/use-word-sets.ts` — уже существует, переиспользуем (берёт сессию через `useSession()` внутри)
- **Шаблон страниц:** Server Component `page.tsx` + Client Component `*-content.tsx` + компоненты фич; страницы с React Query рендерят контент без `<Suspense>` (как в `vocabulary/page.tsx`)
- **Шаблон API:** `apps/web/src/api/*.api.ts` с типизированными методами через `lib/api`
- **Shared типы:** `TrainingWord`, `TrainingResultDto`, `WordSet` из `@repo/types`
- **UI:** shadcn/ui + Tailwind, Lucide-иконки
- **Тесты:** `@repo/web` не имеет тестового фреймворка — нужно настроить vitest в Task 0

## Development Approach

- **Testing approach:** Regular (code first, then tests)
- Завершать каждый таск полностью перед переходом к следующему
- Тесты обязательны для таска с логикой (хуки, вспомогательные функции)
- Следовать шаблонам из `vocabulary/`

## Testing Strategy

- **Unit tests:** настроить vitest + @testing-library/react (Task 0), покрыть хуки и вспомогательные функции
- **E2E tests:** нет Playwright-тестов в проекте — пропускаем

## Progress Tracking

- `[x]` — выполнено
- `➕` — новая задача
- `⚠️` — блокер

## Solution Overview

Страница делится на три логических «экрана», управляемых локальным состоянием в `training-content.tsx`:

1. **`setup`** — выбор набора и старт
2. **`training`** — флеш-карточки с прогрессом
3. **`results`** — итоги сессии

Сессия хранится в `useState` (массив слов, текущий индекс, счётчики верных/неверных). `showTranslation` — локальный стейт в `CardScreen`, сбрасывается при смене карточки. React Query используется только для загрузки данных (наборы, слова). Каждый `POST /training/result` делается через мутацию при переходе к следующей карточке.

**UX для кол-ва слов на стартовом экране:** показываем `wordCount` из `WordSet` (общее число слов в наборе). После нажатия «Начать» загружаем слова — если пришёл пустой массив, возвращаемся на setup с сообщением «Все слова освоены».

## Technical Details

### Данные

```typescript
// Экраны
type Screen = 'setup' | 'training' | 'results';

// Сессия тренировки
interface TrainingSession {
  words: TrainingWord[]; // загруженные слова
  currentIndex: number; // текущая карточка
  correct: number; // верных ответов
  incorrect: number; // неверных ответов
}

// showTranslation — локальный useState в CardScreen (сбрасывается при смене карточки)
```

### Потоки

- `setup` → «Начать» → загрузить слова → если 0 слов: сообщение на setup; иначе → `training`
- Карточка: показать слово → «Показать перевод» → «Знаю»/«Не знаю» → POST result → следующая карточка
- Последняя карточка → `results`
- `results` → «Повторить» → заново загрузить → `training`
- `results` → «В словарь» → `router.push('/vocabulary')`

## What Goes Where

**Implementation Steps** — всё реализуется в этом репозитории.

**Post-Completion:**

- Ручное тестирование сценариев (пустой словарь, набор без слов для тренировки, одно слово)

## Implementation Steps

### Task 0: Настройка тестового фреймворка для @repo/web

**Files:**

- Modify: `apps/web/package.json`
- Create: `apps/web/vitest.config.ts`
- Create: `apps/web/vitest.setup.ts`

- [ ] Установить `vitest`, `@testing-library/react`, `@testing-library/user-event`, `@vitejs/plugin-react`, `jsdom` в devDependencies `apps/web`
- [ ] Создать `apps/web/vitest.config.ts` с окружением jsdom и путём к setup-файлу
- [ ] Создать `apps/web/vitest.setup.ts` (импорт `@testing-library/jest-dom`)
- [ ] Добавить скрипт `"test": "vitest run"` в `apps/web/package.json`
- [ ] Запустить `pnpm --filter @repo/web test` — убедиться что фреймворк работает

### Task 1: API client для тренировки

**Files:**

- Create: `apps/web/src/api/training.api.ts`

- [ ] Создать `trainingApi.getWords(accessToken, params?)` — GET `/training/words` (с опциональными `setId` и `limit`)
- [ ] Создать `trainingApi.submitResult(data, accessToken)` — POST `/training/result`
- [ ] Написать unit-тесты: проверить формирование URL и параметров запроса
- [ ] Запустить тесты — должны пройти перед Task 2

### Task 2: React Query хуки

**Files:**

- Create: `apps/web/src/hooks/use-training.ts`

- [ ] `useTrainingWords(setId?, options?)` — загрузить слова для тренировки; `enabled: false` по умолчанию (запускается через `refetch`)
- [ ] `useSubmitResult()` — мутация для POST `/training/result`
- [ ] Примечание: `useWordSets()` из `apps/web/src/hooks/use-word-sets.ts` переиспользуем как есть, без изменений
- [ ] Написать unit-тесты для новых хуков (мок fetch, проверить вызовы API)
- [ ] Запустить тесты — должны пройти перед Task 3

### Task 3: Основной контейнер (TrainingContent) — скелет с переключением экранов

**Files:**

- Create: `apps/web/src/app/(dashboard)/training/training-content.tsx`

- [ ] Локальное состояние: `screen: Screen`, `session: TrainingSession | null`, `selectedSetId: string | null`
- [ ] Рендерить `<SetupScreen>` / `<CardScreen>` / `<ResultsScreen>` в зависимости от `screen` (заглушки на данном этапе)
- [ ] Функция `handleStart()`: загрузить слова, если 0 — сообщение, иначе переход в `training`
- [ ] Функция `handleAnswer(correct)`: POST result, обновить счётчики, перейти к следующей карточке или в `results`
- [ ] Функция `handleRepeat()`: заново загрузить слова с тем же `setId`, переход в `training`
- [ ] Написать unit-тесты: переходы setup→training→results, обработка пустого массива слов
- [ ] Запустить тесты — должны пройти перед Task 4

### Task 4: Стартовый экран (SetupScreen)

**Files:**

- Create: `apps/web/src/app/(dashboard)/training/setup-screen.tsx`

- [ ] Список наборов (из `useWordSets()`): каждый элемент показывает название и `wordCount` (общее кол-во слов)
- [ ] Опция «Все слова» — всегда первой, без счётчика или с суммой всех слов
- [ ] Выделение выбранного набора (состояние `selectedSetId` пробрасывается из контейнера)
- [ ] Кнопка «Начать тренировку» — вызывает `onStart(selectedSetId)`
- [ ] Если `loadError` (0 слов после загрузки): показать сообщение «Все слова освоены, выберите другой набор»
- [ ] Написать unit-тесты: рендер с наборами, рендер без наборов, выбор набора, кнопка Start
- [ ] Запустить тесты — должны пройти перед Task 5

### Task 5: Экран карточки (CardScreen)

**Files:**

- Create: `apps/web/src/app/(dashboard)/training/card-screen.tsx`

- [ ] Показать слово (крупно, по центру)
- [ ] Локальный `showTranslation: boolean` (начальное значение `false`, сбрасывать при смене `word.id`)
- [ ] Кнопка «Показать перевод» → `setShowTranslation(true)`
- [ ] При `showTranslation`: показать перевод и кнопки «Знаю» (зелёная) и «Не знаю» (красная)
- [ ] Кнопки «Знаю»/«Не знаю»: disabled пока выполняется предыдущая мутация (предотвратить двойной клик)
- [ ] Прогресс-бар: `(currentIndex + 1) / total` с текстом «X из N»
- [ ] Показать `knowledgeLevel` слова (цветной индикатор 0–5)
- [ ] Написать unit-тесты: скрытый/видимый перевод, клик по кнопкам, disabled при загрузке
- [ ] Запустить тесты — должны пройти перед Task 6

### Task 6: Экран результатов (ResultsScreen)

**Files:**

- Create: `apps/web/src/app/(dashboard)/training/results-screen.tsx`

- [ ] Показать итоги: «Знаю: N», «Не знаю: M», «Всего: K»
- [ ] Кнопка «Повторить» — вызывает `onRepeat()`
- [ ] Кнопка «В словарь» — `router.push('/vocabulary')`
- [ ] Написать unit-тесты: корректный рендер итогов, клик по кнопкам
- [ ] Запустить тесты — должны пройти перед Task 7

### Task 7: Страница

**Files:**

- Create: `apps/web/src/app/(dashboard)/training/page.tsx`

- [ ] Server Component, рендерит `<TrainingContent />` напрямую (без `<Suspense>` — как в `vocabulary/page.tsx`)
- [ ] Заголовок страницы («Тренировка»)
- [ ] Проверить что навигационная ссылка `/training` в `nav.tsx` уже есть (не менять)
- [ ] Запустить `pnpm --filter @repo/web typecheck` — должен пройти

### Task 8: Проверка acceptance criteria

- [ ] Стартовый экран показывает наборы и «Все слова»
- [ ] Сообщение «Все слова освоены» при попытке начать с пустым набором
- [ ] Карточка: слово → перевод → «Знаю»/«Не знаю» работает
- [ ] `POST /training/result` вызывается при каждом ответе (проверить в DevTools)
- [ ] Прогресс-бар обновляется корректно
- [ ] Экран результатов показывает верные итоги
- [ ] «Повторить» перезапускает сессию, «В словарь» переходит на `/vocabulary`
- [ ] Запустить `pnpm --filter @repo/web test`
- [ ] Запустить `pnpm --filter @repo/web typecheck`
- [ ] Запустить `pnpm --filter @repo/web lint`

### Task 9: [Final] Обновить документацию

- [ ] Обновить `README.md` если нужно (список реализованных фич)
- [ ] Переместить этот план в `docs/plans/completed/`

## Post-Completion

**Ручное тестирование:**

- Пустой словарь → кнопка «Начать» показывает сообщение «Все слова освоены»
- Набор без слов для тренировки (все `knowledgeLevel = 5`) → то же сообщение
- Одно слово в наборе → сессия из 1 карточки, сразу экран результатов
- Быстрые клики по «Знаю»/«Не знаю» → кнопки заблокированы на время мутации
