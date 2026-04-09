'use client';

import { useEffect, useMemo, useState } from 'react';

import { BookOpen, Plus, Trash2 } from 'lucide-react';

import { KnowledgeBadge } from '@/components/knowledge-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useDeleteWord, useVocabulary } from '../../../hooks/use-vocabulary';
import { useAddWordToSet, useRemoveWordFromSet, useWordSets } from '../../../hooks/use-word-sets';

import { AddWordDialog } from './add-word-dialog';

interface VocabularyTableProps {
  selectedSetId: string | null;
}

export function VocabularyTable({ selectedSetId }: VocabularyTableProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const limit = 20;

  // Дебаунс поиска
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(id);
  }, [search]);

  // При смене фильтров сбрасываем страницу
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, levelFilter, selectedSetId]);

  const params = useMemo(
    () => ({
      page,
      limit,
      search: debouncedSearch || undefined,
      knowledgeLevel: levelFilter !== '' ? Number(levelFilter) : undefined,
    }),
    [page, debouncedSearch, levelFilter],
  );

  const { data, isLoading, isError } = useVocabulary(params);
  const { data: sets = [] } = useWordSets();
  const deleteWord = useDeleteWord();
  const addToSet = useAddWordToSet();
  const removeFromSet = useRemoveWordFromSet();

  const words = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-4">
      {/* Фильтры + кнопка в одну строку */}
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Поиск по слову или переводу..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="border-input bg-background focus:ring-ring rounded-md border px-3 py-2 text-sm focus:ring-2"
        >
          <option value="">Все уровни</option>
          {(['Не знаю', 'Начинающий', 'Знакомо', 'Хорошо', 'Отлично', 'Освоено'] as const).map(
            (label, i) => (
              <option key={i} value={i}>
                {i} — {label}
              </option>
            ),
          )}
        </select>
        <span className="text-muted-foreground text-sm">{isLoading ? '...' : `${total} слов`}</span>
        <Button size="sm" className="ml-auto gap-2" onClick={() => setShowAdd(true)}>
          <Plus className="h-4 w-4" />
          Добавить слово
        </Button>
      </div>

      {isError && <p className="text-destructive text-sm">Не удалось загрузить словарь</p>}

      {!isLoading && words.length === 0 && !isError && (
        <div className="text-muted-foreground flex flex-col items-center gap-3 py-12">
          <BookOpen className="h-10 w-10 opacity-30" />
          <p>Слов не найдено</p>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Слово</th>
              <th className="px-4 py-3 text-left font-medium">Перевод</th>
              <th className="px-4 py-3 text-left font-medium">Уровень</th>
              <th className="px-4 py-3 text-left font-medium">Набор</th>
              <th className="px-4 py-3 text-left font-medium">Добавлено</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="bg-muted h-4 animate-pulse rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              : words.map((word) => {
                  // Наборы, в которых уже есть это слово
                  const wordInSets = new Set(
                    sets
                      .filter(
                        (s) =>
                          // Проверяем по selectedSetId — полный список наборов для слова
                          // недоступен через этот эндпоинт, поэтому показываем текущий выбранный
                          selectedSetId && s.id === selectedSetId,
                      )
                      .map((s) => s.id),
                  );

                  return (
                    <tr key={word.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium">{word.word}</td>
                      <td className="text-muted-foreground px-4 py-3">{word.translation}</td>
                      <td className="px-4 py-3">
                        <KnowledgeBadge level={word.knowledgeLevel} />
                      </td>
                      <td className="px-4 py-3">
                        {sets.length > 0 && (
                          <select
                            className="border-input bg-background rounded border px-2 py-1 text-xs"
                            defaultValue=""
                            onChange={(e) => {
                              const setId = e.target.value;
                              if (!setId) return;
                              if (wordInSets.has(setId)) {
                                removeFromSet.mutate({ setId, wordId: word.id });
                              } else {
                                addToSet.mutate({ setId, wordId: word.id });
                              }
                              e.target.value = '';
                            }}
                          >
                            <option value="">+ набор</option>
                            {sets.map((s) => (
                              <option key={s.id} value={s.id}>
                                {wordInSets.has(s.id) ? '✓ ' : ''}
                                {s.name}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="text-muted-foreground px-4 py-3 text-xs">
                        {new Date(word.createdAt).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive h-8 w-8"
                          onClick={() => deleteWord.mutate(word.id)}
                          disabled={deleteWord.isPending}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>

      {showAdd && <AddWordDialog onClose={() => setShowAdd(false)} />}

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Назад
          </Button>
          <span className="text-muted-foreground text-sm">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Далее
          </Button>
        </div>
      )}
    </div>
  );
}
