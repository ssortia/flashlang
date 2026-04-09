import type { TrainingResultDto, TrainingWord } from '@repo/types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { trainingApi } from './training.api';

// Тестовые данные
const MOCK_TOKEN = 'test-access-token';

const MOCK_WORD: TrainingWord = {
  id: 'word-1',
  word: 'apple',
  translation: 'яблоко',
  knowledgeLevel: 2,
};

// Хелпер: создаёт мок успешного fetch-ответа
function mockFetchOk(data: unknown): void {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(data),
      text: () => Promise.resolve(''),
    }),
  );
}

beforeEach(() => {
  // Сбрасываем мок перед каждым тестом
  vi.restoreAllMocks();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('trainingApi.getWords', () => {
  it('делает GET /training/words без параметров', async () => {
    mockFetchOk([MOCK_WORD]);

    await trainingApi.getWords(MOCK_TOKEN);

    const [url, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0] as [
      string,
      RequestInit,
    ];

    expect(url).toContain('/training/words');
    expect(url).not.toContain('?');
    expect(options.method).toBe('GET');
    expect((options.headers as Record<string, string>)['Authorization']).toBe(
      `Bearer ${MOCK_TOKEN}`,
    );
  });

  it('добавляет setId в query-строку', async () => {
    mockFetchOk([MOCK_WORD]);

    await trainingApi.getWords(MOCK_TOKEN, { setId: 'set-123' });

    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0] as [string];

    expect(url).toContain('setId=set-123');
  });

  it('добавляет limit в query-строку', async () => {
    mockFetchOk([MOCK_WORD]);

    await trainingApi.getWords(MOCK_TOKEN, { limit: 20 });

    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0] as [string];

    expect(url).toContain('limit=20');
  });

  it('добавляет setId и limit одновременно', async () => {
    mockFetchOk([MOCK_WORD]);

    await trainingApi.getWords(MOCK_TOKEN, { setId: 'set-abc', limit: 10 });

    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0] as [string];

    expect(url).toContain('setId=set-abc');
    expect(url).toContain('limit=10');
  });

  it('возвращает массив TrainingWord', async () => {
    mockFetchOk([MOCK_WORD]);

    const result = await trainingApi.getWords(MOCK_TOKEN);

    expect(result).toEqual([MOCK_WORD]);
  });
});

describe('trainingApi.submitResult', () => {
  it('делает POST /training/result с корректным телом', async () => {
    mockFetchOk(MOCK_WORD);

    const dto: TrainingResultDto = { wordId: 'word-1', correct: true };
    await trainingApi.submitResult(dto, MOCK_TOKEN);

    const [url, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0] as [
      string,
      RequestInit,
    ];

    expect(url).toContain('/training/result');
    expect(options.method).toBe('POST');
    expect(JSON.parse(options.body as string)).toEqual(dto);
    expect((options.headers as Record<string, string>)['Authorization']).toBe(
      `Bearer ${MOCK_TOKEN}`,
    );
  });

  it('передаёт correct: false корректно', async () => {
    mockFetchOk(MOCK_WORD);

    const dto: TrainingResultDto = { wordId: 'word-2', correct: false };
    await trainingApi.submitResult(dto, MOCK_TOKEN);

    const [, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0] as [string, RequestInit];

    expect(JSON.parse(options.body as string)).toEqual({ wordId: 'word-2', correct: false });
  });

  it('возвращает обновлённый TrainingWord', async () => {
    const updatedWord: TrainingWord = { ...MOCK_WORD, knowledgeLevel: 3 };
    mockFetchOk(updatedWord);

    const result = await trainingApi.submitResult({ wordId: 'word-1', correct: true }, MOCK_TOKEN);

    expect(result).toEqual(updatedWord);
  });
});
