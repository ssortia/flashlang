import type { TrainingWord } from '@repo/types';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TrainingContent } from './training-content';

// Мок хуков тренировки
vi.mock('@/hooks/use-training', () => ({
  useTrainingWords: vi.fn(),
  useSubmitResult: vi.fn(),
}));

// Мок useWordSets — SetupScreen использует его для списка наборов
vi.mock('@/hooks/use-word-sets', () => ({
  useWordSets: vi.fn(),
}));

import { useSubmitResult, useTrainingWords } from '@/hooks/use-training';
import { useWordSets } from '@/hooks/use-word-sets';

// Тестовые слова
const MOCK_WORDS: TrainingWord[] = [
  { id: 'word-1', word: 'apple', translation: 'яблоко', knowledgeLevel: 1 },
  { id: 'word-2', word: 'banana', translation: 'банан', knowledgeLevel: 2 },
];

/** Возвращает мок refetch — разрешающий переданные слова */
function makeRefetch(words: TrainingWord[]) {
  return vi.fn().mockResolvedValue({ data: words });
}

/** Возвращает мок mutateAsync */
function makeMutateAsync() {
  return vi.fn().mockResolvedValue({});
}

beforeEach(() => {
  vi.clearAllMocks();

  // Дефолтные реализации моков
  vi.mocked(useTrainingWords).mockReturnValue({
    refetch: makeRefetch(MOCK_WORDS),
  } as ReturnType<typeof useTrainingWords>);

  // useWordSets нужен для SetupScreen — возвращаем пустой список в тестах контейнера
  vi.mocked(useWordSets).mockReturnValue({
    data: [],
    isLoading: false,
  } as ReturnType<typeof useWordSets>);

  vi.mocked(useSubmitResult).mockReturnValue({
    mutateAsync: makeMutateAsync(),
    isPending: false,
  } as unknown as ReturnType<typeof useSubmitResult>);
});

describe('TrainingContent — переходы между экранами', () => {
  it('изначально показывает экран setup', () => {
    render(<TrainingContent />);
    expect(screen.getByTestId('setup-screen')).toBeInTheDocument();
  });

  it('переходит в training после нажатия «Начать» если слова есть', async () => {
    render(<TrainingContent />);

    fireEvent.click(screen.getByTestId('start-button'));

    await waitFor(() => {
      expect(screen.getByTestId('card-screen')).toBeInTheDocument();
    });
  });

  it('показывает первое слово после перехода в training', async () => {
    render(<TrainingContent />);

    fireEvent.click(screen.getByTestId('start-button'));

    await waitFor(() => {
      expect(screen.getByTestId('current-word')).toHaveTextContent('apple');
    });
  });

  it('показывает сообщение «все освоены» если слова не пришли', async () => {
    vi.mocked(useTrainingWords).mockReturnValue({
      refetch: makeRefetch([]),
    } as ReturnType<typeof useTrainingWords>);

    render(<TrainingContent />);

    fireEvent.click(screen.getByTestId('start-button'));

    await waitFor(() => {
      expect(screen.getByTestId('all-mastered-message')).toBeInTheDocument();
    });

    // Остаёмся на setup
    expect(screen.getByTestId('setup-screen')).toBeInTheDocument();
  });

  it('переходит к следующей карточке после ответа', async () => {
    render(<TrainingContent />);

    fireEvent.click(screen.getByTestId('start-button'));

    await waitFor(() => {
      expect(screen.getByTestId('current-word')).toHaveTextContent('apple');
    });

    // Открываем перевод перед ответом
    fireEvent.click(screen.getByTestId('show-translation-button'));
    fireEvent.click(screen.getByTestId('know-button'));

    await waitFor(() => {
      expect(screen.getByTestId('current-word')).toHaveTextContent('banana');
    });
  });

  it('переходит на экран results после последней карточки', async () => {
    // Только одно слово в сессии
    vi.mocked(useTrainingWords).mockReturnValue({
      refetch: makeRefetch([MOCK_WORDS[0]]),
    } as ReturnType<typeof useTrainingWords>);

    render(<TrainingContent />);

    fireEvent.click(screen.getByTestId('start-button'));

    await waitFor(() => {
      expect(screen.getByTestId('card-screen')).toBeInTheDocument();
    });

    // Открываем перевод перед ответом
    fireEvent.click(screen.getByTestId('show-translation-button'));
    fireEvent.click(screen.getByTestId('know-button'));

    await waitFor(() => {
      expect(screen.getByTestId('results-screen')).toBeInTheDocument();
    });
  });

  it('учитывает правильные и неправильные ответы в results', async () => {
    render(<TrainingContent />);

    fireEvent.click(screen.getByTestId('start-button'));

    // Первое слово — знаю
    await waitFor(() => expect(screen.getByTestId('current-word')).toHaveTextContent('apple'));
    fireEvent.click(screen.getByTestId('show-translation-button'));
    fireEvent.click(screen.getByTestId('know-button'));

    // Второе слово — не знаю
    await waitFor(() => expect(screen.getByTestId('current-word')).toHaveTextContent('banana'));
    fireEvent.click(screen.getByTestId('show-translation-button'));
    fireEvent.click(screen.getByTestId('dont-know-button'));

    await waitFor(() => {
      expect(screen.getByTestId('correct-count')).toHaveTextContent('Знаю: 1');
      expect(screen.getByTestId('incorrect-count')).toHaveTextContent('Не знаю: 1');
    });
  });

  it('handleRepeat перезапускает сессию с теми же словами', async () => {
    // Только одно слово
    vi.mocked(useTrainingWords).mockReturnValue({
      refetch: makeRefetch([MOCK_WORDS[0]]),
    } as ReturnType<typeof useTrainingWords>);

    render(<TrainingContent />);

    fireEvent.click(screen.getByTestId('start-button'));

    await waitFor(() => expect(screen.getByTestId('card-screen')).toBeInTheDocument());

    // Открываем перевод перед ответом
    fireEvent.click(screen.getByTestId('show-translation-button'));
    fireEvent.click(screen.getByTestId('know-button'));

    await waitFor(() => expect(screen.getByTestId('results-screen')).toBeInTheDocument());

    fireEvent.click(screen.getByTestId('repeat-button'));

    await waitFor(() => {
      expect(screen.getByTestId('card-screen')).toBeInTheDocument();
    });
  });

  it('handleRepeat показывает сообщение если после повтора слов нет', async () => {
    const refetchMock = vi.fn();

    // Первый вызов возвращает одно слово, второй — пустой массив
    refetchMock
      .mockResolvedValueOnce({ data: [MOCK_WORDS[0]] })
      .mockResolvedValueOnce({ data: [] });

    vi.mocked(useTrainingWords).mockReturnValue({
      refetch: refetchMock,
    } as ReturnType<typeof useTrainingWords>);

    render(<TrainingContent />);

    // Запускаем тренировку
    fireEvent.click(screen.getByTestId('start-button'));
    await waitFor(() => expect(screen.getByTestId('card-screen')).toBeInTheDocument());

    // Открываем перевод и отвечаем на единственное слово
    fireEvent.click(screen.getByTestId('show-translation-button'));
    fireEvent.click(screen.getByTestId('know-button'));
    await waitFor(() => expect(screen.getByTestId('results-screen')).toBeInTheDocument());

    // Нажимаем «Повторить» — слов больше нет
    fireEvent.click(screen.getByTestId('repeat-button'));

    await waitFor(() => {
      expect(screen.getByTestId('setup-screen')).toBeInTheDocument();
      expect(screen.getByTestId('all-mastered-message')).toBeInTheDocument();
    });
  });

  it('вызывает submitResult при ответе на карточку', async () => {
    const mutateAsync = makeMutateAsync();
    vi.mocked(useSubmitResult).mockReturnValue({
      mutateAsync,
      isPending: false,
    } as unknown as ReturnType<typeof useSubmitResult>);

    // Одно слово
    vi.mocked(useTrainingWords).mockReturnValue({
      refetch: makeRefetch([MOCK_WORDS[0]]),
    } as ReturnType<typeof useTrainingWords>);

    render(<TrainingContent />);

    fireEvent.click(screen.getByTestId('start-button'));
    await waitFor(() => expect(screen.getByTestId('card-screen')).toBeInTheDocument());

    // Открываем перевод перед ответом
    fireEvent.click(screen.getByTestId('show-translation-button'));
    fireEvent.click(screen.getByTestId('know-button'));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith({ wordId: 'word-1', correct: true });
    });
  });
});
