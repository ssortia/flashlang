# Flashlang

Веб-сервис для изучения английского языка через чтение текстов и заучивание слов.

---

## Возможности

- **Тексты** — добавляй тексты на английском, открывай и читай их в интерактивном ридере
- **Интерактивный ридер** — кликай на слова или выделяй фразы/предложения, чтобы увидеть перевод
- **Словарь** — добавляй слова в персональный словарь с указанием степени знания (0–5)
- **Таблица словаря** — просматривай и фильтруй весь словарь по уровню знания, дате добавления и поисковому запросу
- **Наборы слов** — группируй слова в именованные наборы и тренируй каждый набор отдельно
- **Тренировка** — повторяй слова из словаря (или конкретного набора) в режиме флеш-карточек
- **Аутентификация** — JWT-авторизация, у каждого пользователя свои тексты и словарь
- **Тёмная тема** — переключатель в шапке, сохранение в localStorage

---

## Стек

| Категория          | Технология                  | Версия    |
| ------------------ | --------------------------- | --------- |
| Пакетный менеджер  | pnpm workspaces             | 9+        |
| Оркестрация сборок | Turborepo                   | latest    |
| Backend            | NestJS                      | 11        |
| HTTP-адаптер       | Fastify                     | —         |
| Frontend           | Next.js                     | 15        |
| Аутентификация     | next-auth v5 + JWT          | v5 (beta) |
| ORM                | Prisma                      | 6         |
| База данных        | PostgreSQL                  | 16        |
| Перевод            | MyMemory API                | —         |
| UI-компоненты      | shadcn/ui + Tailwind CSS v4 | —         |
| Валидация          | Zod + class-validator       | —         |
| TypeScript         | —                           | 5.7       |
| Node.js            | —                           | 22+       |

---

## Быстрый старт

```bash
# 1. Клонировать и перейти в директорию
git clone <url> && cd flashlang

# 2. Установить зависимости
pnpm install

# 3. Настроить переменные окружения
cp .env.example .env
# Отредактировать .env: задать JWT_SECRET, NEXTAUTH_SECRET (min 32 символа)

# 4. Запустить PostgreSQL
docker compose up -d db

# 5. Подготовить БД
pnpm --filter @repo/api db:generate  # сгенерировать Prisma Client
pnpm --filter @repo/api db:migrate   # применить миграции
pnpm --filter @repo/api db:seed      # создать пользователя admin@example.com / admin123456

# 6. Запустить проект
pnpm dev
```

После запуска:

- Web: http://localhost:3000
- API: http://localhost:3001
- Swagger: http://localhost:3001/api/docs

---

## Структура проекта

```
apps/
  api/                    # NestJS (Fastify, SWC, JWT auth, Swagger, Prisma)
    src/
      auth/               # JWT-аутентификация
      users/              # Управление пользователями
      texts/              # CRUD текстов
      translation/        # Прокси к MyMemory API
      vocabulary/         # Словарь пользователя
      word-sets/          # Наборы слов для тренировки
      training/           # Данные для тренировки
      prisma/             # Prisma-модуль
  web/                    # Next.js 15 (App Router, next-auth v5, shadcn/ui)
    src/app/
      (auth)/             # /login, /register
      (dashboard)/        # Защищённые маршруты
        texts/            # Список текстов + ридер
        vocabulary/       # Таблица словаря
        training/         # Тренировка (флеш-карточки)
packages/
  types/                  # Общие Zod-схемы: auth + flashlang
  config/
    eslint/               # ESLint flat config
    typescript/           # tsconfig базы
    prettier/             # Prettier конфиг
docker/
  api.Dockerfile
  web.Dockerfile
  nginx.conf
```

---

## Модели данных

```
User ──< Text          # пользователь создаёт тексты
User ──< UserWord      # пользователь накапливает словарь
User ──< WordSet       # пользователь создаёт наборы слов
Text ──< UserWord      # слово может быть привязано к тексту-источнику
UserWord ><< WordSet   # слово может входить в несколько наборов (many-to-many)
```

### Уровни знания слова (knowledgeLevel)

| Уровень | Описание   |
| ------- | ---------- |
| 0       | Незнакомо  |
| 1       | Видел, но… |
| 2       | Сложно     |
| 3       | Средне     |
| 4       | Легко      |
| 5       | Освоено    |

---

## API

| Метод  | Эндпоинт                     | Описание                                     |
| ------ | ---------------------------- | -------------------------------------------- |
| GET    | /texts                       | Список текстов текущего пользователя         |
| POST   | /texts                       | Создать текст                                |
| GET    | /texts/:id                   | Получить текст                               |
| DELETE | /texts/:id                   | Удалить текст                                |
| POST   | /translation                 | Перевести слово или фразу                    |
| GET    | /vocabulary                  | Словарь с фильтрами и пагинацией             |
| POST   | /vocabulary                  | Добавить слово в словарь                     |
| PATCH  | /vocabulary/:id              | Обновить слово (уровень знания/перевод)      |
| DELETE | /vocabulary/:id              | Удалить слово                                |
| GET    | /word-sets                   | Список наборов слов                          |
| POST   | /word-sets                   | Создать набор                                |
| PATCH  | /word-sets/:id               | Переименовать набор                          |
| DELETE | /word-sets/:id               | Удалить набор                                |
| POST   | /word-sets/:id/words         | Добавить слово в набор                       |
| DELETE | /word-sets/:id/words/:wordId | Убрать слово из набора                       |
| GET    | /training/words              | Слова для тренировки (опц. фильтр по набору) |
| POST   | /training/result             | Записать результат тренировки                |

Swagger UI: http://localhost:3001/api/docs

---

## Команды

```bash
pnpm dev                                    # запустить всё в dev-режиме
pnpm build                                  # собрать все пакеты
pnpm lint                                   # ESLint по всему монорепо
pnpm typecheck                              # TypeScript проверка типов
pnpm test                                   # запустить тесты
pnpm format                                 # Prettier форматирование

# База данных
pnpm --filter @repo/api db:generate         # сгенерировать Prisma Client
pnpm --filter @repo/api db:migrate          # создать/применить миграции
pnpm --filter @repo/api db:seed             # заполнить тестовыми данными
pnpm --filter @repo/api db:studio           # открыть Prisma Studio

# Docker
docker compose up -d                        # запустить PostgreSQL локально
docker compose down                         # остановить
```

---

## Документация

| Документ                                                           | Описание                         |
| ------------------------------------------------------------------ | -------------------------------- |
| [docs/DOCUMENTATION.md](./docs/DOCUMENTATION.md)                   | Правила ведения документации     |
| [docs/guides/getting-started.md](./docs/guides/getting-started.md) | Локальная установка шаг за шагом |
| [docs/guides/development.md](./docs/guides/development.md)         | Ежедневный workflow разработчика |
| [docs/guides/adding-a-module.md](./docs/guides/adding-a-module.md) | Добавление новой бизнес-сущности |
| [docs/guides/deployment.md](./docs/guides/deployment.md)           | Деплой в продакшен               |
| [docs/adr/](./docs/adr/)                                           | Архитектурные решения (ADR)      |
| [CLAUDE.md](./CLAUDE.md)                                           | Инструкции для AI-ассистента     |

---

## Лицензия

MIT
