'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { BookmarkPlus, CheckCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { translationApi } from '../../../../api/translation.api';
import { useText } from '../../../../hooks/use-texts';
import { useCreateWord, useVocabulary } from '../../../../hooks/use-vocabulary';

interface TranslationPopup {
  word: string;
  translation: string;
  x: number;
  y: number;
  wordId?: string; // если уже в словаре
}

interface TextReaderProps {
  textId: string;
}

/**
 * Токенизирует текст: возвращает массив токенов.
 * Каждый токен — либо слово (isWord: true), либо разделитель.
 */
function tokenize(text: string): Array<{ value: string; isWord: boolean }> {
  const tokens: Array<{ value: string; isWord: boolean }> = [];
  let lastIndex = 0;
  const regex = /\w+/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ value: text.slice(lastIndex, match.index), isWord: false });
    }
    tokens.push({ value: match[0], isWord: true });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push({ value: text.slice(lastIndex), isWord: false });
  }

  return tokens;
}

export function TextReader({ textId }: TextReaderProps) {
  const { data: session } = useSession();
  const { data: text, isLoading, isError } = useText(textId);
  // Загружаем весь словарь для локального поиска (без лимита)
  const { data: vocabData } = useVocabulary({ limit: 1000 });
  const createWord = useCreateWord();

  const [popup, setPopup] = useState<TranslationPopup | null>(null);
  const [loadingTranslation, setLoadingTranslation] = useState(false);
  const [addedWords, setAddedWords] = useState<Set<string>>(new Set());

  const containerRef = useRef<HTMLDivElement>(null);

  // Словарь пользователя: слово (lowercase) → { translation, id }
  const vocabMap = useMemo(() => {
    const map = new Map<string, { translation: string; id: string }>();
    for (const w of vocabData?.items ?? []) {
      map.set(w.word.toLowerCase(), { translation: w.translation, id: w.id });
    }
    return map;
  }, [vocabData]);

  const tokens = useMemo(() => (text ? tokenize(text.content) : []), [text]);

  // Закрыть попап при клике вне
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setPopup(null);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const showPopup = useCallback(
    (word: string, translation: string, x: number, y: number, wordId?: string) => {
      setPopup({ word, translation, x, y, wordId });
    },
    [],
  );

  async function handleWordClick(word: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (!session?.accessToken) return;

    const lower = word.toLowerCase();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = rect.left + window.scrollX;
    const y = rect.bottom + window.scrollY + 4;

    // Сначала ищем в локальном словаре
    const local = vocabMap.get(lower);
    if (local) {
      showPopup(word, local.translation, x, y, local.id);
      return;
    }

    // Запрашиваем перевод через API
    setLoadingTranslation(true);
    setPopup(null);
    try {
      const result = await translationApi.translate(word, session.accessToken);
      showPopup(word, result.translatedText, x, y);
    } finally {
      setLoadingTranslation(false);
    }
  }

  // Перевод выделенной фразы
  async function handleMouseUp() {
    if (!session?.accessToken) return;
    const selection = window.getSelection();
    const phrase = selection?.toString().trim();
    if (!phrase || phrase.length < 2 || phrase.split(/\s+/).length < 2) return;

    const range = selection!.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const x = rect.left + window.scrollX;
    const y = rect.bottom + window.scrollY + 4;

    setLoadingTranslation(true);
    setPopup(null);
    try {
      const result = await translationApi.translate(phrase, session.accessToken);
      showPopup(phrase, result.translatedText, x, y);
    } finally {
      setLoadingTranslation(false);
    }
  }

  async function handleAddToVocabulary() {
    if (!popup || !session?.accessToken) return;
    if (popup.wordId || addedWords.has(popup.word.toLowerCase())) return;

    await createWord.mutateAsync({
      word: popup.word.toLowerCase(),
      translation: popup.translation,
      textId,
    });

    setAddedWords((prev) => new Set(prev).add(popup.word.toLowerCase()));
    setPopup(null);
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="bg-muted h-6 w-1/3 animate-pulse rounded" />
        <div className="bg-muted h-64 animate-pulse rounded-lg" />
      </div>
    );
  }

  if (isError || !text) {
    return <p className="text-destructive">Не удалось загрузить текст</p>;
  }

  return (
    <div ref={containerRef} className="relative">
      <h2 className="mb-4 text-xl font-bold">{text.title}</h2>

      <Card>
        <CardContent className="pt-6">
          <div className="select-text font-serif text-lg leading-8" onMouseUp={handleMouseUp}>
            {tokens.map((token, i) => {
              if (!token.isWord) {
                return <span key={i}>{token.value}</span>;
              }

              const lower = token.value.toLowerCase();
              const inVocab = vocabMap.has(lower) || addedWords.has(lower);

              return (
                <span
                  key={i}
                  onClick={(e) => handleWordClick(token.value, e)}
                  className={[
                    'cursor-pointer rounded px-0.5 transition-colors',
                    inVocab
                      ? 'text-green-700 underline decoration-dotted dark:text-green-400'
                      : 'hover:bg-accent',
                  ].join(' ')}
                >
                  {token.value}
                </span>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {loadingTranslation && <p className="text-muted-foreground mt-2 text-sm">Переводим...</p>}

      {/* Попап с переводом */}
      {popup && (
        <div
          className="bg-popover text-popover-foreground absolute z-40 min-w-48 rounded-lg border p-3 shadow-lg"
          style={{ left: popup.x, top: popup.y }}
        >
          <p className="text-xs font-medium opacity-60">{popup.word}</p>
          <p className="mt-0.5 text-sm font-semibold">{popup.translation}</p>

          {/* Кнопка добавления — только для одиночных слов */}
          {!popup.word.includes(' ') && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 h-7 w-full gap-1 px-2 text-xs"
              onClick={handleAddToVocabulary}
              disabled={
                createWord.isPending || !!popup.wordId || addedWords.has(popup.word.toLowerCase())
              }
            >
              {popup.wordId || addedWords.has(popup.word.toLowerCase()) ? (
                <>
                  <CheckCircle className="h-3.5 w-3.5 text-green-500" />В словаре
                </>
              ) : (
                <>
                  <BookmarkPlus className="h-3.5 w-3.5" />В словарь
                </>
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
