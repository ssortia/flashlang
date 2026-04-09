import { Badge } from '@/components/ui/badge';

/** Текстовые метки уровней знания (0–5) */
const KNOWLEDGE_LABELS = ['Не знаю', 'Начинающий', 'Знакомо', 'Хорошо', 'Отлично', 'Освоено'];

interface KnowledgeBadgeProps {
  /** Уровень знания 0–5 */
  level: number;
  /** Показывать ли текстовую метку рядом с числом */
  showLabel?: boolean;
  className?: string;
  'data-testid'?: string;
}

/**
 * Цветной Badge для отображения уровня знания слова (0–5).
 * Цвета берутся из CSS-переменных --knowledge-N.
 */
export function KnowledgeBadge({
  level,
  showLabel = true,
  className,
  'data-testid': testId,
}: KnowledgeBadgeProps) {
  const clampedLevel = Math.max(0, Math.min(5, level));
  const label = KNOWLEDGE_LABELS[clampedLevel] ?? String(clampedLevel);

  return (
    <Badge
      className={className}
      style={{
        backgroundColor: `var(--knowledge-${clampedLevel})`,
        color: 'white',
        border: 'none',
      }}
      data-testid={testId}
    >
      {showLabel ? `Уровень ${clampedLevel}: ${label}` : String(clampedLevel)}
    </Badge>
  );
}
