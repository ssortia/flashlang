import type { TrainingWord } from '@repo/types';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CardScreen } from './card-screen';

// Тестовые данные слова
const MOCK_WORD: TrainingWord = {
  id: 'word-1',
  word: 'apple',
  translation: 'яблоко',
  knowledgeLevel: 2,
};

// Дефолтные пропсы для рендера
const defaultProps = {
  word: MOCK_WORD,
  currentIndex: 0,
  total: 5,
  onAnswer: vi.fn(),
  isPending: false,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('CardScreen — отображение слова', () => {
  it('показывает слово крупным текстом', () => {
    render(<CardScreen {...defaultProps} />);
    expect(screen.getByTestId('current-word')).toHaveTextContent('apple');
  });

  it('не показывает перевод по умолчанию', () => {
    render(<CardScreen {...defaultProps} />);
    expect(screen.queryByTestId('translation')).not.toBeInTheDocument();
  });

  it('показывает кнопку «Показать перевод» по умолчанию', () => {
    render(<CardScreen {...defaultProps} />);
    expect(screen.getByTestId('show-translation-button')).toBeInTheDocument();
  });

  it('не показывает кнопки «Знаю»/«Не знаю» до открытия перевода', () => {
    render(<CardScreen {...defaultProps} />);
    expect(screen.queryByTestId('know-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('dont-know-button')).not.toBeInTheDocument();
  });
});

describe('CardScreen — открытие перевода', () => {
  it('показывает перевод после клика «Показать перевод»', () => {
    render(<CardScreen {...defaultProps} />);
    fireEvent.click(screen.getByTestId('show-translation-button'));
    expect(screen.getByTestId('translation')).toHaveTextContent('яблоко');
  });

  it('скрывает кнопку «Показать перевод» после клика', () => {
    render(<CardScreen {...defaultProps} />);
    fireEvent.click(screen.getByTestId('show-translation-button'));
    expect(screen.queryByTestId('show-translation-button')).not.toBeInTheDocument();
  });

  it('показывает кнопки «Знаю»/«Не знаю» после открытия перевода', () => {
    render(<CardScreen {...defaultProps} />);
    fireEvent.click(screen.getByTestId('show-translation-button'));
    expect(screen.getByTestId('know-button')).toBeInTheDocument();
    expect(screen.getByTestId('dont-know-button')).toBeInTheDocument();
  });
});

describe('CardScreen — ответы на карточку', () => {
  it('вызывает onAnswer(true) при клике «Знаю»', () => {
    const onAnswer = vi.fn();
    render(<CardScreen {...defaultProps} onAnswer={onAnswer} />);
    fireEvent.click(screen.getByTestId('show-translation-button'));
    fireEvent.click(screen.getByTestId('know-button'));
    expect(onAnswer).toHaveBeenCalledWith(true);
  });

  it('вызывает onAnswer(false) при клике «Не знаю»', () => {
    const onAnswer = vi.fn();
    render(<CardScreen {...defaultProps} onAnswer={onAnswer} />);
    fireEvent.click(screen.getByTestId('show-translation-button'));
    fireEvent.click(screen.getByTestId('dont-know-button'));
    expect(onAnswer).toHaveBeenCalledWith(false);
  });

  it('блокирует кнопки «Знаю»/«Не знаю» при isPending=true', () => {
    render(<CardScreen {...defaultProps} isPending />);
    fireEvent.click(screen.getByTestId('show-translation-button'));
    expect(screen.getByTestId('know-button')).toBeDisabled();
    expect(screen.getByTestId('dont-know-button')).toBeDisabled();
  });

  it('кнопки «Знаю»/«Не знаю» активны при isPending=false', () => {
    render(<CardScreen {...defaultProps} isPending={false} />);
    fireEvent.click(screen.getByTestId('show-translation-button'));
    expect(screen.getByTestId('know-button')).not.toBeDisabled();
    expect(screen.getByTestId('dont-know-button')).not.toBeDisabled();
  });
});

describe('CardScreen — прогресс', () => {
  it('показывает текст прогресса «X из N»', () => {
    render(<CardScreen {...defaultProps} currentIndex={2} total={10} />);
    expect(screen.getByTestId('progress-text')).toHaveTextContent('3 из 10');
  });

  it('корректно показывает прогресс для первой карточки', () => {
    render(<CardScreen {...defaultProps} currentIndex={0} total={5} />);
    expect(screen.getByTestId('progress-text')).toHaveTextContent('1 из 5');
  });

  it('корректно показывает прогресс для последней карточки', () => {
    render(<CardScreen {...defaultProps} currentIndex={4} total={5} />);
    expect(screen.getByTestId('progress-text')).toHaveTextContent('5 из 5');
  });
});

describe('CardScreen — индикатор уровня знания', () => {
  it('показывает уровень знания слова', () => {
    render(<CardScreen {...defaultProps} />);
    expect(screen.getByTestId('knowledge-level')).toBeInTheDocument();
    expect(screen.getByTestId('knowledge-level')).toHaveTextContent('Уровень 2');
  });

  it('показывает уровень 0 для нового слова', () => {
    const word: TrainingWord = { ...MOCK_WORD, knowledgeLevel: 0 };
    render(<CardScreen {...defaultProps} word={word} />);
    expect(screen.getByTestId('knowledge-level')).toHaveTextContent('Уровень 0');
  });

  it('показывает уровень 5 для освоенного слова', () => {
    const word: TrainingWord = { ...MOCK_WORD, knowledgeLevel: 5 };
    render(<CardScreen {...defaultProps} word={word} />);
    expect(screen.getByTestId('knowledge-level')).toHaveTextContent('Уровень 5');
  });
});

describe('CardScreen — сброс состояния при смене слова', () => {
  it('скрывает перевод при смене word.id', () => {
    const { rerender } = render(<CardScreen {...defaultProps} />);

    // Открываем перевод
    fireEvent.click(screen.getByTestId('show-translation-button'));
    expect(screen.getByTestId('translation')).toBeInTheDocument();

    // Меняем слово
    const newWord: TrainingWord = {
      id: 'word-2',
      word: 'banana',
      translation: 'банан',
      knowledgeLevel: 1,
    };
    rerender(<CardScreen {...defaultProps} word={newWord} />);

    // Перевод должен быть снова скрыт
    expect(screen.queryByTestId('translation')).not.toBeInTheDocument();
    expect(screen.getByTestId('show-translation-button')).toBeInTheDocument();
  });

  it('показывает новое слово после смены', () => {
    const { rerender } = render(<CardScreen {...defaultProps} />);

    const newWord: TrainingWord = {
      id: 'word-2',
      word: 'banana',
      translation: 'банан',
      knowledgeLevel: 1,
    };
    rerender(<CardScreen {...defaultProps} word={newWord} />);

    expect(screen.getByTestId('current-word')).toHaveTextContent('banana');
  });
});
