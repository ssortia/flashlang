import { VocabularyContent } from './vocabulary-content';

export default function VocabularyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Словарь</h2>
        <p className="text-muted-foreground mt-1">Твои слова и наборы для тренировки</p>
      </div>
      <VocabularyContent />
    </div>
  );
}
