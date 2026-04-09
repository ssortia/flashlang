# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Придерживайся следующих правил:

1. Описывай что ты делаешь
2. Используй для ответов РУССКИЙ язык
3. Делай все качественно архитектурно (и в соответствии с общепринятыми стандартами применяемых технологий)
4. Комментарии к коду пиши на русском языке
5. Когда предлагаешь внести какое-то изминение в код кратко пиши что делаешь и для чего
6. В commit message всегда указывай номер GitHub issue, в рамках которого делается коммит — через `(refs #N)` или `(closes #N)` в конце первой строки. Это нужно чтобы коммит отображался в issue на GitHub.
7. После завершения реализации задачи — не коммитить сразу. Сообщить пользователю что реализация готова и дождаться его подтверждения перед коммитом.
8. Когда пользователь говорит «создай задачу», «поставь задачу», «добавь задачу» или подобные фразы — создавать GitHub issue через `gh issue create`, а не TaskCreate.
9. Пользователь тоже может ошибаться. Если замечаешь нелогичное решение, потенциальную проблему или явно плохую практику — сообщи об этом прямо и предложи альтернативные варианты. Не молчи из вежливости.
10. Когда пользователь просит «сохранить план в файл» — сохранять в файл внутри проекта (например, в `docs/guides/`), а не во внутреннюю память Claude.

## Project Overview

**Flashlang** — веб-сервис для изучения английского языка. Пользователь добавляет тексты, читает их в интерактивном ридере (клик на слово → перевод из словаря, выделение фразы → MyMemory API), накапливает персональный словарь со шкалой знания 0–5 и тренирует слова через флеш-карточки.

## Monorepo Tooling

- **Package manager**: pnpm with workspaces (`pnpm-workspace.yaml`)
- **Build orchestration**: Turborepo (`turbo.json`)
- **Node version**: defined in `.nvmrc` / `package.json#engines`

## Common Commands

```bash
# Установить зависимости
pnpm install

# Запустить всё в dev-режиме
pnpm dev

# Сборка всех пакетов
pnpm build

# Линтинг монорепо
pnpm lint

# Проверка типов
pnpm typecheck

# Тесты
pnpm test

# Тесты конкретного пакета
pnpm --filter @repo/web test
pnpm --filter @repo/api test

# База данных
pnpm --filter @repo/api db:generate  # сгенерировать Prisma Client
pnpm --filter @repo/api db:migrate   # применить миграции
pnpm --filter @repo/api db:seed      # заполнить тестовыми данными
pnpm --filter @repo/api db:studio    # открыть Prisma Studio

# Docker (локальная инфраструктура: postgres)
docker compose up -d
docker compose down
```

## Repository Structure

Полная структура проекта описана в `README.md`. Краткий обзор:

- `apps/api` — NestJS backend (Fastify, SWC, JWT auth, Swagger)
  - `src/texts/` — CRUD текстов
  - `src/translation/` — прокси к MyMemory API
  - `src/vocabulary/` — словарь пользователя
  - `src/training/` — данные для тренировки флеш-карточками
- `apps/web` — Next.js 15 frontend (App Router, next-auth v5, shadcn/ui)
  - `src/app/(dashboard)/texts/` — список текстов и интерактивный ридер
  - `src/app/(dashboard)/vocabulary/` — таблица словаря с фильтрами
  - `src/app/(dashboard)/training/` — тренировка (флеш-карточки)
- `packages/types` — общие Zod-схемы: `auth.ts` + `flashlang.ts`
- `docker/` — Dockerfile-ы и nginx.conf

## Architecture Decisions

### API (`apps/api`)

- Uses **Fastify** adapter (not Express) for performance
- Uses **SWC** compiler (not `tsc`) for faster builds
- Global `ValidationPipe` with `class-validator` + `class-transformer`
- Swagger docs at `/api/docs`
- Health check at `/health`
- Structured logging via `nestjs-pino`
- Env validation via `zod` at startup
- Module structure: `auth`, `users`, `prisma`, `texts`, `translation`, `vocabulary`, `training`

### Web (`apps/web`)

- Next.js 15 with **App Router** and `src/` directory
- `@/*` path alias resolves to `src/`
- Turbopack enabled in dev mode
- Typesafe env via `@t3-oss/env-nextjs`
- Server state: `@tanstack/react-query`
- Client state: `zustand`
- Forms: `react-hook-form` + `zod`
- Auth: `next-auth` v5
- UI components: shadcn/ui in `src/components/ui/`, utilities in `src/lib/utils.ts`

### Flashlang-специфические решения

- **Ридер**: токенизация текста на клиенте (`\w+` регулярка), одно слово → из локального словаря, фраза → `POST /translation` (ADR-010)
- **Перевод**: MyMemory API через NestJS-прокси `/translation`, провайдер изолирован в `TranslationService` (ADR-011)
- **Прогресс слова**: `knowledgeLevel: Int` 0–5, +1 за верный ответ на тренировке, -1 за неверный (ADR-012)

### Shared Packages

- `@repo/types` — Zod-схемы: `auth.ts` (User, Tokens, Role) и `flashlang.ts` (Text, UserWord, Translation, Training)

### TypeScript

- `packages/config/typescript/base.json` is the root tsconfig; each app/package extends it
- Strict mode enabled everywhere

### ESLint

- ESLint v9 flat config
- Separate rule sets for NestJS (Node) and Next.js (browser/React) contexts
- `eslint-plugin-import` enforces import order

## Environment Variables

See `.env.example` at the root. Each app reads its own subset:

| Variable                          | Used by |
| --------------------------------- | ------- |
| `DATABASE_URL`                    | api     |
| `JWT_SECRET`, `JWT_EXPIRES_IN`    | api     |
| `NEXTAUTH_SECRET`, `NEXTAUTH_URL` | web     |
| `NEXT_PUBLIC_API_URL`             | web     |

## Документация

Авторитетный источник правил ведения документации — [`docs/DOCUMENTATION.md`](./docs/DOCUMENTATION.md).

Ключевые правила:

- **Новое архитектурное решение** → создать ADR в `docs/adr/` по шаблону из `docs/adr/README.md` и добавить строку в индекс.
- **Новый гайд или фича** → добавить/обновить соответствующий файл в `docs/guides/`.
- **Список фич в README.md** должен отражать реальное состояние шаблона — обновлять при добавлении/удалении возможностей.
- **Комментарии в коде** — только «почему», не «что». JSDoc только на публичном API пакетов.

Расположение документации:

```
docs/
  DOCUMENTATION.md   # мета-правила ведения доков
  adr/               # Architecture Decision Records
  guides/            # практические руководства
```
