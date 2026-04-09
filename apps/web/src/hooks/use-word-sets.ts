'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

import { wordSetsApi } from '../api/word-sets.api';

export function useWordSets() {
  const { data: session } = useSession();
  return useQuery({
    queryKey: ['word-sets'],
    queryFn: () => wordSetsApi.list(session!.accessToken!),
    enabled: !!session?.accessToken,
  });
}

export function useCreateWordSet() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => wordSetsApi.create(name, session!.accessToken!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['word-sets'] }),
  });
}

export function useDeleteWordSet() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => wordSetsApi.delete(id, session!.accessToken!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['word-sets'] }),
  });
}

export function useAddWordToSet() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ setId, wordId }: { setId: string; wordId: string }) =>
      wordSetsApi.addWord(setId, wordId, session!.accessToken!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['word-sets'] }),
  });
}

export function useRemoveWordFromSet() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ setId, wordId }: { setId: string; wordId: string }) =>
      wordSetsApi.removeWord(setId, wordId, session!.accessToken!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['word-sets'] }),
  });
}
