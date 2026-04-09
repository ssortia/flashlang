'use client';

import { useState } from 'react';

import { VocabularyTable } from './vocabulary-table';
import { WordSetsPanel } from './word-sets-panel';

export function VocabularyContent() {
  // Выбранный набор для фильтрации (null — все слова)
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null);

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <WordSetsPanel selectedSetId={selectedSetId} onSelectSet={setSelectedSetId} />
      <VocabularyTable selectedSetId={selectedSetId} />
    </div>
  );
}
