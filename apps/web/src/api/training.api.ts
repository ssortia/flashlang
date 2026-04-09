import type { TrainingResultDto, TrainingWord } from '@repo/types';

import { api } from '../lib/api';

/** Параметры запроса слов для тренировки */
export interface GetTrainingWordsParams {
  /** ID набора слов (если не указан — все слова пользователя) */
  setId?: string;
  /** Максимальное кол-во слов в сессии */
  limit?: number;
}

export const trainingApi = {
  /**
   * Получить слова для тренировки (knowledgeLevel < 5).
   * GET /training/words?setId=&limit=
   */
  getWords: (accessToken: string, params?: GetTrainingWordsParams) =>
    api.get<TrainingWord[]>('/training/words', {
      accessToken,
      params: {
        setId: params?.setId,
        limit: params?.limit !== undefined ? String(params.limit) : undefined,
      },
    }),

  /**
   * Отправить результат ответа на карточку.
   * POST /training/result → обновлённый TrainingWord
   */
  submitResult: (data: TrainingResultDto, accessToken: string) =>
    api.post<TrainingWord>('/training/result', data, { accessToken }),
};
