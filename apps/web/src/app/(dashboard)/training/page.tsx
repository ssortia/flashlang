import { TrainingContent } from './training-content';

export default function TrainingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Тренировка</h2>
        <p className="text-muted-foreground mt-1">Тренируй слова в режиме флеш-карточек</p>
      </div>
      <TrainingContent />
    </div>
  );
}
