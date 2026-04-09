'use client';

import { BookOpen } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useWordSets } from '@/hooks/use-word-sets';
import { cn } from '@/lib/utils';
import type { WordSet } from '@repo/types';

interface SetupScreenProps {
  /** Идентификатор выбранного набора (null — «Все слова») */
  selectedSetId: string | null;
  /** Обработчик выбора набора */
  onSelectSet: (id: string | null) => void;
  /** Обработчик нажатия «Начать тренировку» */
  onStart: () => void;
  /** Флаг «все слова освоены» (показывается после попытки начать с пустым набором) */
  allMastered: boolean;
  /** Флаг загрузки слов (во время вызова fetchWords) */
  isLoading: boolean;
}

export function SetupScreen({
  selectedSetId,
  onSelectSet,
  onStart,
  allMastered,
  isLoading,
}: SetupScreenProps) {
  const { data: wordSets = [], isLoading: isSetsLoading } = useWordSets();

  return (
    <div className="mx-auto max-w-lg" data-testid="setup-screen">
      <Card>
        <CardHeader>
          <CardTitle>Тренировка слов</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          <p className="text-muted-foreground mb-3 text-sm">Выберите набор для тренировки:</p>

          {/* Опция «Все слова» — всегда первой */}
          <SetOption
            label="Все слова"
            wordCount={wordSets.reduce((sum: number, s: WordSet) => sum + s.wordCount, 0)}
            isSelected={selectedSetId === null}
            onClick={() => onSelectSet(null)}
          />

          {/* Скелетон пока загружаются наборы */}
          {isSetsLoading && (
            <div className="space-y-1">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="bg-muted h-10 animate-pulse rounded-md" />
              ))}
            </div>
          )}

          {/* Список пользовательских наборов */}
          {wordSets.map((set) => (
            <SetOption
              key={set.id}
              label={set.name}
              wordCount={set.wordCount}
              isSelected={selectedSetId === set.id}
              onClick={() => onSelectSet(set.id)}
            />
          ))}

          {/* Сообщение «Все слова освоены» */}
          {allMastered && (
            <p className="text-destructive mt-2 text-sm" data-testid="all-mastered-message">
              Все слова освоены, выберите другой набор
            </p>
          )}
        </CardContent>

        <CardFooter>
          <Button
            className="w-full"
            onClick={onStart}
            disabled={isLoading}
            data-testid="start-button"
          >
            {isLoading ? 'Загрузка...' : 'Начать тренировку'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

// ──────────────────────────────────────────────
// Вспомогательный компонент: элемент списка набора
// ──────────────────────────────────────────────

interface SetOptionProps {
  label: string;
  wordCount: number;
  isSelected: boolean;
  onClick: () => void;
}

function SetOption({ label, wordCount, isSelected, onClick }: SetOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-sm transition-colors',
        isSelected
          ? 'bg-accent text-accent-foreground font-medium'
          : 'text-muted-foreground hover:bg-accent/50',
      )}
    >
      <BookOpen className="h-4 w-4 shrink-0" />
      <span className="flex-1 text-left">{label}</span>
      {wordCount > 0 && <span className="text-muted-foreground text-xs">{wordCount}</span>}
    </button>
  );
}
