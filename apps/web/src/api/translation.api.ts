import type { TranslationResponse } from '@repo/types';

import { api } from '../lib/api';

export const translationApi = {
  translate: (text: string, accessToken: string, langPair = 'en|ru') =>
    api.post<TranslationResponse>('/translation', { text, langPair }, { accessToken }),
};
