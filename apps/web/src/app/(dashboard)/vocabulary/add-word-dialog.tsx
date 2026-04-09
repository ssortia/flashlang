'use client';

import { useState } from 'react';

import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useCreateWord } from '../../../hooks/use-vocabulary';

interface AddWordDialogProps {
  onClose: () => void;
}

const KNOWLEDGE_LABELS = [
  '0 — Незнакомо',
  '1 — Видел',
  '2 — Сложно',
  '3 — Средне',
  '4 — Легко',
  '5 — Освоено',
];

export function AddWordDialog({ onClose }: AddWordDialogProps) {
  const [word, setWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [knowledgeLevel, setKnowledgeLevel] = useState(0);
  const createWord = useCreateWord();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!word.trim() || !translation.trim()) return;
    await createWord.mutateAsync({
      word: word.trim().toLowerCase(),
      translation: translation.trim(),
      knowledgeLevel,
    });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-background w-full max-w-sm rounded-xl border p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Добавить слово</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="word">Слово</Label>
            <Input
              id="word"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="apple"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="translation">Перевод</Label>
            <Input
              id="translation"
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              placeholder="яблоко"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="level">Уровень знания</Label>
            <select
              id="level"
              value={knowledgeLevel}
              onChange={(e) => setKnowledgeLevel(Number(e.target.value))}
              className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
            >
              {KNOWLEDGE_LABELS.map((label, i) => (
                <option key={i} value={i}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {createWord.isError && (
            <p className="text-destructive text-sm">
              {(createWord.error as Error)?.message?.includes('409')
                ? 'Это слово уже есть в словаре'
                : 'Не удалось добавить слово'}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" disabled={createWord.isPending}>
              {createWord.isPending ? 'Сохранение...' : 'Добавить'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
