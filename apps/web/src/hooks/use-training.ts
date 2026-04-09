'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

import type { TrainingResultDto } from '@repo/types';
import type { GetTrainingWordsParams } from '../api/training.api';
import { trainingApi } from '../api/training.api';

/** Хук для загрузки слов для тренировки.
 * По умолчанию запрос отключён (enabled: false) — запускается через refetch.
 */
export function useTrainingWords(setId?: string, options?: { limit?: number }) {
  const { data: session } = useSession();

  const params: GetTrainingWordsParams = {};
  if (setId) params.setId = setId;
  if (options?.limit !== undefined) params.limit = options.limit;

  return useQuery({
    queryKey: ['training-words', setId, options?.limit],
    queryFn: () => trainingApi.getWords(session!.accessToken!, params),
    // Отключён по умолчанию — запускается вручную через refetch
    enabled: false,
  });
}

/** Хук для отправки результата ответа на карточку.
 * POST /training/result → обновлённый TrainingWord
 */
export function useSubmitResult() {
  const { data: session } = useSession();

  return useMutation({
    mutationFn: (data: TrainingResultDto) => trainingApi.submitResult(data, session!.accessToken!),
  });
}
