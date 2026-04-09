'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

import type { CreateWordParams, ListVocabularyParams } from '../api/vocabulary.api';
import { vocabularyApi } from '../api/vocabulary.api';

export function useVocabulary(params?: ListVocabularyParams) {
  const { data: session } = useSession();
  return useQuery({
    queryKey: ['vocabulary', params],
    queryFn: () => vocabularyApi.list(session!.accessToken!, params),
    enabled: !!session?.accessToken,
  });
}

export function useCreateWord() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateWordParams) => vocabularyApi.create(data, session!.accessToken!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vocabulary'] }),
  });
}

export function useDeleteWord() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => vocabularyApi.delete(id, session!.accessToken!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vocabulary'] }),
  });
}
