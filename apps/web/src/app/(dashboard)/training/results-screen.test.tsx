import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ResultsScreen } from './results-screen';

// Мок next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Дефолтные пропсы для рендера
const defaultProps = {
  correct: 7,
  incorrect: 3,
  onRepeat: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('ResultsScreen — рендер итогов', () => {
  it('показывает заголовок «Результаты тренировки»', () => {
    render(<ResultsScreen {...defaultProps} />);
    expect(screen.getByText('Результаты тренировки')).toBeInTheDocument();
  });

  it('показывает общее количество слов (correct + incorrect)', () => {
    render(<ResultsScreen {...defaultProps} />);
    expect(screen.getByTestId('total-count')).toHaveTextContent('10');
  });

  it('показывает количество верных ответов', () => {
    render(<ResultsScreen {...defaultProps} />);
    expect(screen.getByTestId('correct-count')).toHaveTextContent('7');
  });

  it('показывает количество неверных ответов', () => {
    render(<ResultsScreen {...defaultProps} />);
    expect(screen.getByTestId('incorrect-count')).toHaveTextContent('3');
  });

  it('корректно считает итоги при всех верных ответах', () => {
    render(<ResultsScreen correct={5} incorrect={0} onRepeat={vi.fn()} />);
    expect(screen.getByTestId('total-count')).toHaveTextContent('5');
    expect(screen.getByTestId('correct-count')).toHaveTextContent('5');
    expect(screen.getByTestId('incorrect-count')).toHaveTextContent('0');
  });

  it('корректно считает итоги при всех неверных ответах', () => {
    render(<ResultsScreen correct={0} incorrect={4} onRepeat={vi.fn()} />);
    expect(screen.getByTestId('total-count')).toHaveTextContent('4');
    expect(screen.getByTestId('correct-count')).toHaveTextContent('0');
    expect(screen.getByTestId('incorrect-count')).toHaveTextContent('4');
  });
});

describe('ResultsScreen — кнопки', () => {
  it('вызывает onRepeat при клике на «Повторить»', () => {
    const onRepeat = vi.fn();
    render(<ResultsScreen {...defaultProps} onRepeat={onRepeat} />);

    fireEvent.click(screen.getByTestId('repeat-button'));
    expect(onRepeat).toHaveBeenCalledTimes(1);
  });

  it('переходит на /vocabulary при клике на «В словарь»', () => {
    render(<ResultsScreen {...defaultProps} />);

    fireEvent.click(screen.getByTestId('to-vocabulary-button'));
    expect(mockPush).toHaveBeenCalledWith('/vocabulary');
  });

  it('кнопки «Повторить» и «В словарь» присутствуют в DOM', () => {
    render(<ResultsScreen {...defaultProps} />);
    expect(screen.getByTestId('repeat-button')).toBeInTheDocument();
    expect(screen.getByTestId('to-vocabulary-button')).toBeInTheDocument();
  });
});
