import type { WordSet } from '@repo/types';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SetupScreen } from './setup-screen';

// Мок хука useWordSets
vi.mock('@/hooks/use-word-sets', () => ({
  useWordSets: vi.fn(),
}));

import { useWordSets } from '@/hooks/use-word-sets';

// Тестовые данные наборов
const MOCK_SETS: WordSet[] = [
  {
    id: 'set-1',
    userId: 'user-1',
    name: 'Базовый',
    wordCount: 10,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'set-2',
    userId: 'user-1',
    name: 'Продвинутый',
    wordCount: 5,
    createdAt: new Date('2024-01-02'),
  },
];

// Дефолтные пропсы для рендера
const defaultProps = {
  selectedSetId: null,
  onSelectSet: vi.fn(),
  onStart: vi.fn(),
  allMastered: false,
  isLoading: false,
};

beforeEach(() => {
  vi.clearAllMocks();

  // По умолчанию хук возвращает тестовые наборы
  vi.mocked(useWordSets).mockReturnValue({
    data: MOCK_SETS,
    isLoading: false,
  } as ReturnType<typeof useWordSets>);
});

describe('SetupScreen — рендер', () => {
  it('показывает заголовок и кнопку «Начать тренировку»', () => {
    render(<SetupScreen {...defaultProps} />);
    expect(screen.getByText('Тренировка слов')).toBeInTheDocument();
    expect(screen.getByTestId('start-button')).toBeInTheDocument();
  });

  it('всегда показывает опцию «Все слова» первой', () => {
    render(<SetupScreen {...defaultProps} />);
    const buttons = screen.getAllByRole('button');
    // Первая кнопка — «Все слова» (не считая кнопку «Начать тренировку»)
    expect(buttons[0]).toHaveTextContent('Все слова');
  });

  it('показывает список пользовательских наборов', () => {
    render(<SetupScreen {...defaultProps} />);
    expect(screen.getByText('Базовый')).toBeInTheDocument();
    expect(screen.getByText('Продвинутый')).toBeInTheDocument();
  });

  it('показывает wordCount рядом с названием набора', () => {
    render(<SetupScreen {...defaultProps} />);
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('рендерится корректно без наборов (пустой список)', () => {
    vi.mocked(useWordSets).mockReturnValue({
      data: [],
      isLoading: false,
    } as unknown as ReturnType<typeof useWordSets>);

    render(<SetupScreen {...defaultProps} />);
    // Опция «Все слова» всё равно присутствует
    expect(screen.getByText('Все слова')).toBeInTheDocument();
    // Пользовательских наборов нет
    expect(screen.queryByText('Базовый')).not.toBeInTheDocument();
  });

  it('не показывает сообщение «Все слова освоены» по умолчанию', () => {
    render(<SetupScreen {...defaultProps} />);
    expect(screen.queryByTestId('all-mastered-message')).not.toBeInTheDocument();
  });

  it('показывает сообщение «Все слова освоены» при allMastered=true', () => {
    render(<SetupScreen {...defaultProps} allMastered />);
    expect(screen.getByTestId('all-mastered-message')).toBeInTheDocument();
    expect(screen.getByTestId('all-mastered-message')).toHaveTextContent(
      'Все слова освоены, выберите другой набор',
    );
  });
});

describe('SetupScreen — выбор набора', () => {
  it('вызывает onSelectSet(null) при клике на «Все слова»', () => {
    const onSelectSet = vi.fn();
    render(<SetupScreen {...defaultProps} selectedSetId="set-1" onSelectSet={onSelectSet} />);

    fireEvent.click(screen.getByText('Все слова'));
    expect(onSelectSet).toHaveBeenCalledWith(null);
  });

  it('вызывает onSelectSet с id набора при клике на набор', () => {
    const onSelectSet = vi.fn();
    render(<SetupScreen {...defaultProps} onSelectSet={onSelectSet} />);

    fireEvent.click(screen.getByText('Базовый'));
    expect(onSelectSet).toHaveBeenCalledWith('set-1');
  });

  it('выделяет «Все слова» если selectedSetId === null', () => {
    render(<SetupScreen {...defaultProps} selectedSetId={null} />);

    // Кнопка «Все слова» должна иметь активный класс
    const allWordsButton = screen.getAllByRole('button')[0];
    expect(allWordsButton).toHaveClass('bg-accent');
  });

  it('выделяет выбранный набор', () => {
    render(<SetupScreen {...defaultProps} selectedSetId="set-2" />);

    // Находим кнопку «Продвинутый»
    const setButton = screen.getByText('Продвинутый').closest('button');
    expect(setButton).toHaveClass('bg-accent');
  });
});

describe('SetupScreen — кнопка старта', () => {
  it('вызывает onStart при клике на кнопку «Начать тренировку»', () => {
    const onStart = vi.fn();
    render(<SetupScreen {...defaultProps} onStart={onStart} />);

    fireEvent.click(screen.getByTestId('start-button'));
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it('кнопка заблокирована при isLoading=true', () => {
    render(<SetupScreen {...defaultProps} isLoading />);
    expect(screen.getByTestId('start-button')).toBeDisabled();
  });

  it('кнопка показывает «Загрузка...» при isLoading=true', () => {
    render(<SetupScreen {...defaultProps} isLoading />);
    expect(screen.getByTestId('start-button')).toHaveTextContent('Загрузка...');
  });

  it('кнопка активна при isLoading=false', () => {
    render(<SetupScreen {...defaultProps} isLoading={false} />);
    expect(screen.getByTestId('start-button')).not.toBeDisabled();
  });
});
