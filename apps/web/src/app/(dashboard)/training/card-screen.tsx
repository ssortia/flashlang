'use client';

import { useEffect, useState } from 'react';

import { KnowledgeBadge } from '@/components/knowledge-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import type { TrainingWord } from '@repo/types';

interface CardScreenProps {
  /** Текущее слово для тренировки */
  word: TrainingWord;
  /** Индекс текущей карточки (0-based) */
  currentIndex: number;
  /** Общее количество карточек в сессии */
  total: number;
  /** Обработчик ответа: true — знаю, false — не знаю */
  onAnswer: (correct: boolean) => void;
  /** Флаг ожидания мутации (блокирует кнопки «Знаю»/«Не знаю») */
  isPending: boolean;
}

export function CardScreen({ word, currentIndex, total, onAnswer, isPending }: CardScreenProps) {
  // Показывать ли перевод
  const [showTranslation, setShowTranslation] = useState(false);

  // Сбрасываем состояние показа перевода при смене слова
  useEffect(() => {
    setShowTranslation(false);
  }, [word.id]);

  const progressPercent = ((currentIndex + 1) / total) * 100;

  return (
    <div className="mx-auto max-w-lg" data-testid="card-screen">
      {/* Прогресс */}
      <div className="mb-4 space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground" data-testid="progress-text">
            {currentIndex + 1} из {total}
          </span>
          {/* Индикатор уровня знания */}
          <KnowledgeBadge level={word.knowledgeLevel} data-testid="knowledge-level" />
        </div>

        {/* Прогресс-бар */}
        <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
          <div
            className="bg-primary h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
            data-testid="progress-bar"
            role="progressbar"
            aria-valuenow={currentIndex + 1}
            aria-valuemin={1}
            aria-valuemax={total}
          />
        </div>
      </div>

      <Card>
        <CardHeader className="items-center pb-2">
          {/* Слово — крупно, по центру */}
          <p className="text-4xl font-bold tracking-wide" data-testid="current-word">
            {word.word}
          </p>
        </CardHeader>

        <CardContent className="flex min-h-[80px] items-center justify-center">
          {showTranslation ? (
            /* Перевод показывается после нажатия кнопки */
            <p className="text-muted-foreground text-center text-xl" data-testid="translation">
              {word.translation}
            </p>
          ) : (
            <Button
              variant="outline"
              onClick={() => setShowTranslation(true)}
              data-testid="show-translation-button"
            >
              Показать перевод
            </Button>
          )}
        </CardContent>

        {/* Кнопки «Знаю» / «Не знаю» — только когда перевод открыт */}
        {showTranslation && (
          <CardFooter className="gap-3">
            <Button
              className="flex-1 bg-red-500 text-white hover:bg-red-600"
              onClick={() => onAnswer(false)}
              disabled={isPending}
              data-testid="dont-know-button"
            >
              Не знаю
            </Button>
            <Button
              className="flex-1 bg-green-600 text-white hover:bg-green-700"
              onClick={() => onAnswer(true)}
              disabled={isPending}
              data-testid="know-button"
            >
              Знаю
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
