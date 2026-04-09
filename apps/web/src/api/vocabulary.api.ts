import type { UserWord, VocabularyResponse } from '@repo/types';

import { api } from '../lib/api';

export interface CreateWordParams {
  word: string;
  translation: string;
  knowledgeLevel?: number;
  textId?: string;
}

export interface ListVocabularyParams {
  page?: number;
  limit?: number;
  search?: string;
  knowledgeLevel?: number;
}

export const vocabularyApi = {
  list: (accessToken: string, params?: ListVocabularyParams) =>
    api.get<VocabularyResponse>('/vocabulary', {
      accessToken,
      params: {
        page: params?.page !== undefined ? String(params.page) : undefined,
        limit: params?.limit !== undefined ? String(params.limit) : undefined,
        search: params?.search,
        knowledgeLevel:
          params?.knowledgeLevel !== undefined ? String(params.knowledgeLevel) : undefined,
      },
    }),

  create: (data: CreateWordParams, accessToken: string) =>
    api.post<UserWord>('/vocabulary', data, { accessToken }),

  update: (id: string, data: Partial<CreateWordParams>, accessToken: string) =>
    api.patch<UserWord>(`/vocabulary/${id}`, data, { accessToken }),

  delete: (id: string, accessToken: string) =>
    api.delete<void>(`/vocabulary/${id}`, { accessToken }),
};
