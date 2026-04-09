'use client';

import { useState } from 'react';

import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useCreateText } from '../../../hooks/use-texts';

interface AddTextDialogProps {
  onClose: () => void;
}

export function AddTextDialog({ onClose }: AddTextDialogProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const createText = useCreateText();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    await createText.mutateAsync({ title: title.trim(), content: content.trim() });
    onClose();
  }

  return (
    /* Оверлей */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-background w-full max-w-lg rounded-xl border p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Добавить текст</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Название</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Article about AI"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="content">Текст</Label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Вставь текст на английском..."
              required
              rows={8}
              className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50"
            />
          </div>

          {createText.isError && (
            <p className="text-destructive text-sm">Не удалось добавить текст</p>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" disabled={createText.isPending}>
              {createText.isPending ? 'Сохранение...' : 'Добавить'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
