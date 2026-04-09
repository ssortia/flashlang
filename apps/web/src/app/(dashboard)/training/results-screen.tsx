'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ResultsScreenProps {
  /** Количество верных ответов */
  correct: number;
  /** Количество неверных ответов */
  incorrect: number;
  /** Обработчик повтора тренировки */
  onRepeat: () => void;
}

export function ResultsScreen({ correct, incorrect, onRepeat }: ResultsScreenProps) {
  const router = useRouter();
  const total = correct + incorrect;

  return (
    <div className="mx-auto max-w-lg" data-testid="results-screen">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Результаты тренировки</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Итоговая статистика */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Всего</p>
              <p className="text-2xl font-bold" data-testid="total-count">
                {total}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Знаю</p>
              <p className="text-2xl font-bold text-green-600" data-testid="correct-count">
                {correct}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Не знаю</p>
              <p className="text-2xl font-bold text-red-500" data-testid="incorrect-count">
                {incorrect}
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => router.push('/vocabulary')}
            data-testid="to-vocabulary-button"
          >
            В словарь
          </Button>
          <Button className="flex-1" onClick={onRepeat} data-testid="repeat-button">
            Повторить
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
