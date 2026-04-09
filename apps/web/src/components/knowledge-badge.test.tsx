import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { KnowledgeBadge } from './knowledge-badge';

describe('KnowledgeBadge — рендер', () => {
  it('отображает уровень и метку при showLabel=true (по умолчанию)', () => {
    render(<KnowledgeBadge level={3} />);
    expect(screen.getByText('Уровень 3: Хорошо')).toBeInTheDocument();
  });

  it('отображает только число при showLabel=false', () => {
    render(<KnowledgeBadge level={2} showLabel={false} />);
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.queryByText(/Знакомо/)).not.toBeInTheDocument();
  });

  it('использует CSS-переменную --knowledge-N для цвета фона', () => {
    render(<KnowledgeBadge level={5} data-testid="badge" />);
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveStyle({ backgroundColor: 'var(--knowledge-5)' });
  });

  it('зажимает уровень до 0 при level < 0', () => {
    render(<KnowledgeBadge level={-1} showLabel={false} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('зажимает уровень до 5 при level > 5', () => {
    render(<KnowledgeBadge level={10} showLabel={false} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('рендерит корректно уровень 0 (Не знаю)', () => {
    render(<KnowledgeBadge level={0} />);
    expect(screen.getByText('Уровень 0: Не знаю')).toBeInTheDocument();
  });

  it('рендерит корректно уровень 5 (Освоено)', () => {
    render(<KnowledgeBadge level={5} />);
    expect(screen.getByText('Уровень 5: Освоено')).toBeInTheDocument();
  });

  it('передаёт data-testid', () => {
    render(<KnowledgeBadge level={1} data-testid="kb" />);
    expect(screen.getByTestId('kb')).toBeInTheDocument();
  });
});
