'use client';

import { useState } from 'react';

import { useSubmitResult, useTrainingWords } from '@/hooks/use-training';
import type { TrainingWord } from '@repo/types';

import { SetupScreen } from './setup-screen';

// Типы экранов тренировки
type Screen = 'setup' | 'training' | 'results';

// Сессия тренировки
interface TrainingSession {
  words: TrainingWord[];
  currentIndex: number;
  correct: number;
  incorrect: number;
}

export function TrainingContent() {
  // Текущий экран
  const [screen, setScreen] = useState<Screen>('setup');
  // Сессия тренировки
  const [session, setSession] = useState<TrainingSession | null>(null);
  // Выбранный набор слов (null — все слова)
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null);
  // Флаг «все слова освоены» (пустой массив после загрузки)
  const [allMastered, setAllMastered] = useState(false);

  // isLoading нужен для блокировки кнопки «Начать» во время загрузки слов
  const [isStarting, setIsStarting] = useState(false);

  const { refetch: fetchWords } = useTrainingWords(selectedSetId ?? undefined);
  const submitResult = useSubmitResult();

  /** Запустить тренировку: загрузить слова и перейти на экран карточек */
  async function handleStart() {
    setAllMastered(false);
    setIsStarting(true);
    const result = await fetchWords();
    setIsStarting(false);
    const words = result.data ?? [];

    if (words.length === 0) {
      // Все слова освоены — остаёмся на setup с сообщением
      setAllMastered(true);
      return;
    }

    setSession({
      words,
      currentIndex: 0,
      correct: 0,
      incorrect: 0,
    });
    setScreen('training');
  }

  /** Обработать ответ на карточку: отправить результат, обновить счётчики */
  async function handleAnswer(correct: boolean) {
    if (!session) return;

    const currentWord = session.words[session.currentIndex];

    // Отправляем результат на сервер
    await submitResult.mutateAsync({ wordId: currentWord.id, correct });

    const newSession: TrainingSession = {
      ...session,
      correct: correct ? session.correct + 1 : session.correct,
      incorrect: correct ? session.incorrect : session.incorrect + 1,
    };

    const isLastCard = session.currentIndex >= session.words.length - 1;

    if (isLastCard) {
      // Последняя карточка — переходим к результатам
      setSession(newSession);
      setScreen('results');
    } else {
      // Переходим к следующей карточке
      setSession({ ...newSession, currentIndex: session.currentIndex + 1 });
    }
  }

  /** Повторить тренировку: заново загрузить слова с тем же набором */
  async function handleRepeat() {
    setAllMastered(false);
    const result = await fetchWords();
    const words = result.data ?? [];

    if (words.length === 0) {
      setAllMastered(true);
      setScreen('setup');
      return;
    }

    setSession({
      words,
      currentIndex: 0,
      correct: 0,
      incorrect: 0,
    });
    setScreen('training');
  }

  if (screen === 'setup') {
    return (
      <SetupScreen
        selectedSetId={selectedSetId}
        onSelectSet={setSelectedSetId}
        onStart={handleStart}
        allMastered={allMastered}
        isLoading={isStarting}
      />
    );
  }

  if (screen === 'training' && session) {
    const currentWord = session.words[session.currentIndex];
    return (
      <div data-testid="card-screen">
        <p>Экран карточки (CardScreen)</p>
        <p data-testid="current-word">{currentWord.word}</p>
        <p>
          Карточка {session.currentIndex + 1} из {session.words.length}
        </p>
        <button onClick={() => handleAnswer(true)} data-testid="know-button">
          Знаю
        </button>
        <button onClick={() => handleAnswer(false)} data-testid="dont-know-button">
          Не знаю
        </button>
      </div>
    );
  }

  if (screen === 'results' && session) {
    return (
      <div data-testid="results-screen">
        <p>Экран результатов (ResultsScreen)</p>
        <p data-testid="correct-count">Знаю: {session.correct}</p>
        <p data-testid="incorrect-count">Не знаю: {session.incorrect}</p>
        <button onClick={handleRepeat} data-testid="repeat-button">
          Повторить
        </button>
        <button onClick={() => setSelectedSetId(selectedSetId)} data-testid="to-vocabulary-button">
          В словарь
        </button>
      </div>
    );
  }

  return null;
}
