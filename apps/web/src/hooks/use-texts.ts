'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

import type { CreateTextParams } from '../api/texts.api';
import { textsApi } from '../api/texts.api';

export function useTexts(page = 1, limit = 20) {
  const { data: session } = useSession();
  return useQuery({
    queryKey: ['texts', page, limit],
    queryFn: () => textsApi.list(session!.accessToken!, page, limit),
    enabled: !!session?.accessToken,
  });
}

export function useText(id: string) {
  const { data: session } = useSession();
  return useQuery({
    queryKey: ['texts', id],
    queryFn: () => textsApi.get(id, session!.accessToken!),
    enabled: !!session?.accessToken && !!id,
  });
}

export function useCreateText() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTextParams) => textsApi.create(data, session!.accessToken!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['texts'] }),
  });
}

export function useDeleteText() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => textsApi.delete(id, session!.accessToken!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['texts'] }),
  });
}
