# Design System: UI/UX и визуальный стиль — issue #16

## Overview

Реализовать дизайн-систему для Flashlang: задать цветовую палитру, типографику, дизайн-токены, обновить навигацию (sidebar), и привести все страницы к единому стилю.

**Проблема:** Сейчас используется дефолтная shadcn/ui тема (тёмно-синий primary, серые акценты) — нет узнаваемого характера, нет semantic цветов для уровней знания, навигация горизонтальная в header.

**Ключевые изменения:**

- Собственная цветовая палитра (primary + accent + semantic: success/warning/info)
- Подключение шрифта (Geist)
- Токены для уровней знания (0–5) — используются в тренировке и словаре
- Sidebar навигация вместо горизонтальной в header
- Обновление layout-ов всех dashboard-страниц
- Полировка auth-страниц (login/register)

**Интеграция:** Изменения в `globals.css` автоматически распространяются на все shadcn/ui компоненты. Sidebar заменяет текущий `<Nav>` + `layout.tsx` дашборда.

## Context (from discovery)

- **globals.css** — Tailwind v4 + CSS-переменные (двойной набор: `--color-*` для Tailwind и `--*` для shadcn-zod-bridge)
- **Компоненты shadcn/ui**: Button, Card, Input, Label, Badge — 5 штук в `src/components/ui/`
- **Dashboard layout**: `apps/web/src/app/(dashboard)/layout.tsx` — header с горизонтальной навигацией
- **Страницы**: texts, vocabulary, training, admin/users, auth/login, auth/register
- **Темизация**: next-themes уже настроен, dark mode через класс `.dark`
- **Шрифт**: сейчас system-ui стек, нет кастомного шрифта
- **Нет** semantic цветов (success/warning/info), нет токенов для knowledgeLevel

## Development Approach

- **Testing approach:** Regular (code first, then tests)
- Завершать каждый таск полностью перед переходом к следующему
- Начать с токенов (Task 1) — всё остальное опирается на них
- Тесты только для компонентов с логикой (sidebar toggle, активная ссылка)
- Визуальные изменения CSS/layout — без тестов, проверка typecheck

## Testing Strategy

- **Unit tests:** тест sidebar (активная ссылка, collapse на мобиле)
- **E2E:** нет Playwright в проекте — пропускаем
- Остальное: `typecheck` + `lint` после каждого таска

## Progress Tracking

- `[x]` — выполнено
- `➕` — новая задача
- `⚠️` — блокер

## Solution Overview

**Дизайн-решения:**

- **Палитра**: Indigo/Violet как primary (образовательное приложение — интеллект, доверие), Emerald как success (правильный ответ), Rose как destructive, Amber как warning
- **Типографика**: Geist Sans (от Vercel, оптимизирован для Next.js через `next/font/google`)
- **Sidebar**: фиксированный левый сайдбар на десктопе, выдвижной (Sheet) на мобиле — паттерн как в Linear/Notion
- **Уровни знания**: 6 токенов (`--knowledge-0` … `--knowledge-5`), серый → зелёный градиент
- **Semantic colors**: success (emerald), warning (amber), info (sky) — используются в Badge и индикаторах

**Структура токенов:**

```
globals.css
  @theme { --color-primary: indigo, --color-accent: violet, ... }
  :root { --background, --primary, --success, --warning, ... }
  .dark { тёмные варианты всех токенов }
  :root { --knowledge-0..5 }
```

## Technical Details

### Цветовая палитра (light / dark)

| Токен       | Light                      | Dark                       |
| ----------- | -------------------------- | -------------------------- |
| primary     | indigo-600 `262° 83% 58%`  | indigo-400 `239° 84% 67%`  |
| accent      | violet-100 `270° 100% 97%` | violet-950 `270° 45% 12%`  |
| success     | emerald-600 `158° 64% 42%` | emerald-400 `152° 75% 60%` |
| warning     | amber-500 `38° 92% 50%`    | amber-400 `43° 96% 56%`    |
| destructive | rose-500 `350° 89% 60%`    | rose-500 (без изменений)   |

### Knowledge level токены

```css
--knowledge-0: hsl(0 0% 65%); /* неизвестно — серый */
--knowledge-1: hsl(38 92% 50%); /* amber */
--knowledge-2: hsl(45 93% 47%); /* yellow */
--knowledge-3: hsl(84 81% 44%); /* lime */
--knowledge-4: hsl(142 71% 45%); /* green */
--knowledge-5: hsl(158 64% 42%); /* emerald — освоено */
```

### Sidebar layout

```
┌──────────┬──────────────────────────────┐
│  ⚡ Flash │  header (лого + user + theme)│ h-16
│   lang   ├──────────────────────────────┤
│──────────│                              │
│ 📄 Тексты│  <main>                      │
│ 📚 Словарь│  {children}                 │
│ 🎴 Трени  │                              │
│──────────│                              │
│ [admin]  │                              │
└──────────┴──────────────────────────────┘
  w-64        flex-1
```

## What Goes Where

**Implementation Steps** — реализуется в этом репозитории.

**Post-Completion:**

- Ручная проверка всех страниц в светлой и тёмной теме
- Проверка на мобильном (320px, 375px, 768px)
- Визуальная проверка уровней знания в словаре и тренировке

## Implementation Steps

### Task 1: Цветовая палитра и дизайн-токены

**Files:**

- Modify: `apps/web/src/app/globals.css`

- [x] Заменить primary на indigo, добавить accent (violet)
- [x] Добавить semantic токены: `--color-success`, `--color-warning`, `--color-info` в @theme
- [x] Продублировать в `:root` (для shadcn-zod-bridge) и `.dark`
- [x] Добавить `--knowledge-0` … `--knowledge-5` в `:root` и `.dark`
- [x] Обновить `--radius` до `0.625rem` (чуть мягче)
- [x] Запустить `pnpm --filter @repo/web typecheck` — должен пройти

### Task 2: Типографика — подключить Geist

**Files:**

- Modify: `apps/web/src/app/layout.tsx`
- Modify: `apps/web/src/app/globals.css`

- [x] Импортировать `Geist` из `next/font/google` в корневом `layout.tsx`
- [x] Передать класс шрифта на `<html>` через `geist.variable` + `className={geist.variable}`
- [x] Обновить `--font-sans` в `@theme` на `var(--font-geist-sans)` + системный стек
- [x] Запустить `pnpm --filter @repo/web typecheck` — должен пройти

### Task 3: Sidebar компонент

**Files:**

- Create: `apps/web/src/components/sidebar.tsx`
- Create: `apps/web/src/components/sidebar.test.tsx`

- [x] Создать `<Sidebar>` — фиксированный `w-64` на десктопе с nav-ссылками и логотипом
- [x] На мобиле (< md): скрыт, открывается через CSS-overlay (без Sheet — нет shadcn CLI)
- [x] Кнопка-гамбургер в header только на мобиле (управляет состоянием)
- [x] Активная ссылка — `bg-accent text-accent-foreground rounded-md`
- [x] Иконки для ссылок: BookOpen (Тексты/Словарь), Zap (Тренировка), Users (Пользователи) из lucide-react
- [x] Написать тест: активная ссылка выделяется при pathname совпадении
- [x] Написать тест: admin-ссылка скрыта без isAdmin
- [x] Запустить тесты — должны пройти

### Task 4: Обновить Dashboard layout

**Files:**

- Modify: `apps/web/src/app/(dashboard)/layout.tsx`

- [x] Заменить горизонтальную навигацию на `<Sidebar>` через AppShell Client Component
- [x] Header: только мобильный логотип, user email, ThemeToggle, кнопка Выйти
- [x] Layout: `flex` row — desktop aside слева, `<main>` `flex-1` справа
- [x] Main: `overflow-y-auto`, `p-6 md:p-8`
- [x] `<Nav>` компонент не используется в layout (файл сохранён)
- [x] Запустить `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`

### Task 5: Полировка auth-страниц (login / register)

**Files:**

- Modify: `apps/web/src/app/(auth)/login/page.tsx`
- Modify: `apps/web/src/components/auth/login-form.tsx`
- Modify: `apps/web/src/app/(auth)/register/page.tsx` (если есть)
- Modify: `apps/web/src/components/auth/register-form.tsx` (если есть)

- [x] Страница: логотип Flashlang сверху карточки
- [x] Убрать `title: 'Login | NexST'` → заменить на `'Войти | Flashlang'`
- [x] Ссылки «Нет аккаунта? Зарегистрироваться» и «Уже есть аккаунт? Войти» уже были
- [x] Стилизация через токены работает автоматически
- [x] Запустить `pnpm --filter @repo/web typecheck`

### Task 6: Компонент KnowledgeBadge

**Files:**

- Create: `apps/web/src/components/knowledge-badge.tsx`
- Create: `apps/web/src/components/knowledge-badge.test.tsx`

- [x] Создать `<KnowledgeBadge level={0..5} />` — цветной Badge с уровнем знания
- [x] Использовать `--knowledge-N` токены через inline style
- [x] Заменить существующие индикаторы уровня в `card-screen.tsx` и `vocabulary-table.tsx` на KnowledgeBadge
- [x] Написать тест: рендерится с правильным числом, применяется нужный стиль (8 тестов)
- [x] Запустить тесты — должны пройти

### Task 7: Проверка acceptance criteria

- [x] Все токены определены (primary, accent, success, warning, destructive, knowledge-0..5)
- [x] Geist подключён через next/font/google
- [x] Sidebar работает на десктопе (w-64, фиксированный)
- [x] Sidebar работает на мобиле (CSS-overlay, открывается по гамбургеру)
- [x] Активная ссылка sidebar подсвечивается
- [x] Auth-страницы показывают `Flashlang` вместо `NexST`
- [x] KnowledgeBadge используется в card-screen и vocabulary-table
- [x] Светлая и тёмная тема — токены определены для обоих вариантов
- [x] Запустить `pnpm --filter @repo/web test` — 97 тестов ✅
- [x] Запустить `pnpm --filter @repo/web typecheck` — ✅
- [x] Запустить `pnpm --filter @repo/web lint` — ✅

### Task 8: [Final] Обновить документацию

- [ ] Добавить ADR в `docs/adr/` о выборе дизайн-системы (палитра, шрифт)
- [ ] Обновить README.md если нужно
- [ ] Переместить этот план в `docs/plans/completed/`

## Post-Completion

**Ручное тестирование:**

- Открыть каждую страницу в светлой и тёмной теме
- Проверить на ширине 320px (mobile), 768px (tablet), 1280px (desktop)
- Проверить карточки тренировки — индикатор уровня знания через KnowledgeBadge
- Проверить таблицу словаря — уровни знания через KnowledgeBadge
- Убедиться что shadcn-zod-bridge (bridge-формы) отображают правильные цвета
