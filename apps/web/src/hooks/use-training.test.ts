import type { TrainingResultDto, TrainingWord } from '@repo/types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { trainingApi } from '../api/training.api';
import { useSubmitResult, useTrainingWords } from './use-training';

// Мок API модуля тренировки
vi.mock('../api/training.api', () => ({
  trainingApi: {
    getWords: vi.fn(),
    submitResult: vi.fn(),
  },
}));

// Тестовые данные
const MOCK_WORD: TrainingWord = {
  id: 'word-1',
  word: 'apple',
  translation: 'яблоко',
  knowledgeLevel: 2,
};

/** Создаёт обёртку с QueryClientProvider для renderHook */
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useTrainingWords', () => {
  it('по умолчанию запрос отключён (enabled: false)', () => {
    const { result } = renderHook(() => useTrainingWords(), {
      wrapper: createWrapper(),
    });

    // Хук не должен автоматически запускать запрос
    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(trainingApi.getWords).not.toHaveBeenCalled();
  });

  it('передаёт setId в API при вызове refetch', async () => {
    vi.mocked(trainingApi.getWords).mockResolvedValue([MOCK_WORD]);

    const { result } = renderHook(() => useTrainingWords('set-123'), {
      wrapper: createWrapper(),
    });

    await result.current.refetch();

    expect(trainingApi.getWords).toHaveBeenCalledWith('test-token', { setId: 'set-123' });
  });

  it('передаёт limit в API при вызове refetch', async () => {
    vi.mocked(trainingApi.getWords).mockResolvedValue([MOCK_WORD]);

    const { result } = renderHook(() => useTrainingWords(undefined, { limit: 20 }), {
      wrapper: createWrapper(),
    });

    await result.current.refetch();

    expect(trainingApi.getWords).toHaveBeenCalledWith('test-token', { limit: 20 });
  });

  it('передаёт setId и limit одновременно', async () => {
    vi.mocked(trainingApi.getWords).mockResolvedValue([MOCK_WORD]);

    const { result } = renderHook(() => useTrainingWords('set-abc', { limit: 10 }), {
      wrapper: createWrapper(),
    });

    await result.current.refetch();

    expect(trainingApi.getWords).toHaveBeenCalledWith('test-token', {
      setId: 'set-abc',
      limit: 10,
    });
  });

  it('не добавляет setId в params если он не указан', async () => {
    vi.mocked(trainingApi.getWords).mockResolvedValue([MOCK_WORD]);

    const { result } = renderHook(() => useTrainingWords(), {
      wrapper: createWrapper(),
    });

    await result.current.refetch();

    // setId не должен быть в объекте params
    const callArgs = vi.mocked(trainingApi.getWords).mock.calls[0];
    expect(callArgs[1]).not.toHaveProperty('setId');
  });

  it('возвращает данные после успешного refetch', async () => {
    vi.mocked(trainingApi.getWords).mockResolvedValue([MOCK_WORD]);

    const { result } = renderHook(() => useTrainingWords(), {
      wrapper: createWrapper(),
    });

    // Ждём завершения refetch и проверяем результат
    const refetchResult = await result.current.refetch();

    expect(refetchResult.data).toEqual([MOCK_WORD]);
  });
});

describe('useSubmitResult', () => {
  it('вызывает trainingApi.submitResult с корректными данными', async () => {
    const updatedWord: TrainingWord = { ...MOCK_WORD, knowledgeLevel: 3 };
    vi.mocked(trainingApi.submitResult).mockResolvedValue(updatedWord);

    const { result } = renderHook(() => useSubmitResult(), {
      wrapper: createWrapper(),
    });

    const dto: TrainingResultDto = { wordId: 'word-1', correct: true };
    result.current.mutate(dto);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(trainingApi.submitResult).toHaveBeenCalledWith(dto, 'test-token');
  });

  it('передаёт correct: false корректно', async () => {
    vi.mocked(trainingApi.submitResult).mockResolvedValue(MOCK_WORD);

    const { result } = renderHook(() => useSubmitResult(), {
      wrapper: createWrapper(),
    });

    const dto: TrainingResultDto = { wordId: 'word-2', correct: false };
    result.current.mutate(dto);

    await waitFor(() => {
      expect(trainingApi.submitResult).toHaveBeenCalledWith(dto, 'test-token');
    });
  });

  it('возвращает обновлённый TrainingWord после мутации', async () => {
    const updatedWord: TrainingWord = { ...MOCK_WORD, knowledgeLevel: 4 };
    vi.mocked(trainingApi.submitResult).mockResolvedValue(updatedWord);

    const { result } = renderHook(() => useSubmitResult(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ wordId: 'word-1', correct: true });

    await waitFor(() => {
      expect(result.current.data).toEqual(updatedWord);
    });
  });

  it('корректно обрабатывает ошибку мутации', async () => {
    const error = new Error('Network error');
    vi.mocked(trainingApi.submitResult).mockRejectedValue(error);

    const { result } = renderHook(() => useSubmitResult(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ wordId: 'word-1', correct: true });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});
