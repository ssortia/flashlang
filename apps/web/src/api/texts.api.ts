import type { Text, TextListResponse } from '@repo/types';

import { api } from '../lib/api';

export interface CreateTextParams {
  title: string;
  content: string;
}

export const textsApi = {
  list: (accessToken: string, page = 1, limit = 20) =>
    api.get<TextListResponse>('/texts', {
      accessToken,
      params: { page: String(page), limit: String(limit) },
    }),

  get: (id: string, accessToken: string) => api.get<Text>(`/texts/${id}`, { accessToken }),

  create: (data: CreateTextParams, accessToken: string) =>
    api.post<Text>('/texts', data, { accessToken }),

  delete: (id: string, accessToken: string) => api.delete<void>(`/texts/${id}`, { accessToken }),
};
