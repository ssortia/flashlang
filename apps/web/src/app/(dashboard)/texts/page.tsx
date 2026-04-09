import { Suspense } from 'react';

import { TextsList } from './texts-list';

export default function TextsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Тексты</h2>
        <p className="text-muted-foreground mt-1">Твои тексты для чтения и изучения слов</p>
      </div>
      <Suspense fallback={<TextsListSkeleton />}>
        <TextsList />
      </Suspense>
    </div>
  );
}

function TextsListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-muted h-20 animate-pulse rounded-lg" />
      ))}
    </div>
  );
}
