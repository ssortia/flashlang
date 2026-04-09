'use client';

import { useState } from 'react';

import { FolderOpen, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import { useCreateWordSet, useDeleteWordSet, useWordSets } from '../../../hooks/use-word-sets';

interface WordSetsPanelProps {
  selectedSetId: string | null;
  onSelectSet: (id: string | null) => void;
}

export function WordSetsPanel({ selectedSetId, onSelectSet }: WordSetsPanelProps) {
  const { data: sets = [], isLoading } = useWordSets();
  const createSet = useCreateWordSet();
  const deleteSet = useDeleteWordSet();
  const [newSetName, setNewSetName] = useState('');

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newSetName.trim()) return;
    await createSet.mutateAsync(newSetName.trim());
    setNewSetName('');
  }

  async function handleDelete(id: string) {
    // Снять выбор если удаляем активный набор
    if (selectedSetId === id) onSelectSet(null);
    await deleteSet.mutateAsync(id);
  }

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Наборы слов</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Все слова */}
        <button
          onClick={() => onSelectSet(null)}
          className={cn(
            'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
            selectedSetId === null
              ? 'bg-accent text-accent-foreground font-medium'
              : 'text-muted-foreground hover:bg-accent/50',
          )}
        >
          <FolderOpen className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left">Все слова</span>
        </button>

        {/* Список наборов */}
        {isLoading ? (
          <div className="space-y-1">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="bg-muted h-8 animate-pulse rounded-md" />
            ))}
          </div>
        ) : (
          sets.map((set) => (
            <div
              key={set.id}
              className={cn(
                'group flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                selectedSetId === set.id
                  ? 'bg-accent text-accent-foreground font-medium'
                  : 'text-muted-foreground hover:bg-accent/50',
              )}
            >
              <button
                onClick={() => onSelectSet(set.id)}
                className="flex flex-1 items-center gap-2 text-left"
              >
                <FolderOpen className="h-4 w-4 shrink-0" />
                <span className="flex-1 truncate">{set.name}</span>
                <span className="text-muted-foreground text-xs">{set.wordCount}</span>
              </button>
              <button
                onClick={() => handleDelete(set.id)}
                className="text-destructive shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                disabled={deleteSet.isPending}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))
        )}

        {/* Форма создания набора */}
        <form onSubmit={handleCreate} className="flex gap-1.5 pt-2">
          <Input
            value={newSetName}
            onChange={(e) => setNewSetName(e.target.value)}
            placeholder="Новый набор..."
            className="h-8 text-sm"
          />
          <Button
            type="submit"
            size="icon"
            className="h-8 w-8 shrink-0"
            disabled={!newSetName.trim() || createSet.isPending}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
