'use client';

import { useState } from 'react';

import { BookOpen, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useDeleteText, useTexts } from '../../../hooks/use-texts';

import { AddTextDialog } from './add-text-dialog';

export function TextsList() {
  const [showAdd, setShowAdd] = useState(false);
  const { data, isLoading, isError } = useTexts();
  const deleteText = useDeleteText();

  const texts = data?.items ?? [];

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {isLoading ? '...' : `${data?.total ?? 0} текстов`}
        </p>
        <Button onClick={() => setShowAdd(true)} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Добавить текст
        </Button>
      </div>

      {isError && <p className="text-destructive text-sm">Не удалось загрузить тексты</p>}

      {!isLoading && texts.length === 0 && !isError && (
        <div className="text-muted-foreground flex flex-col items-center gap-3 py-12">
          <BookOpen className="h-10 w-10 opacity-30" />
          <p>Нет текстов. Добавь первый!</p>
        </div>
      )}

      <div className="space-y-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-muted h-20 animate-pulse rounded-lg" />
            ))
          : texts.map((text) => (
              <Card key={text.id} className="group">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base">{text.title}</CardTitle>
                  <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <Link
                      href={`/texts/${text.id}`}
                      className="hover:bg-accent inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors"
                    >
                      <BookOpen className="h-4 w-4" />
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => deleteText.mutate(text.id)}
                      disabled={deleteText.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-2 text-sm">{text.content}</p>
                  <p className="text-muted-foreground mt-2 text-xs">
                    {new Date(text.createdAt).toLocaleDateString('ru-RU')}
                  </p>
                </CardContent>
              </Card>
            ))}
      </div>

      {showAdd && <AddTextDialog onClose={() => setShowAdd(false)} />}
    </>
  );
}
