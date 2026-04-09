import type { WordSet } from '@repo/types';

import { api } from '../lib/api';

export const wordSetsApi = {
  list: (accessToken: string) => api.get<WordSet[]>('/word-sets', { accessToken }),

  create: (name: string, accessToken: string) =>
    api.post<WordSet>('/word-sets', { name }, { accessToken }),

  rename: (id: string, name: string, accessToken: string) =>
    api.patch<WordSet>(`/word-sets/${id}`, { name }, { accessToken }),

  delete: (id: string, accessToken: string) =>
    api.delete<void>(`/word-sets/${id}`, { accessToken }),

  addWord: (setId: string, wordId: string, accessToken: string) =>
    api.post<void>(`/word-sets/${setId}/words`, { wordId }, { accessToken }),

  removeWord: (setId: string, wordId: string, accessToken: string) =>
    api.delete<void>(`/word-sets/${setId}/words/${wordId}`, { accessToken }),
};
