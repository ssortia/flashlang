import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MobileDrawer, MobileMenuButton, SidebarNav } from './sidebar';

// Мок next/navigation
const mockPathname = vi.fn(() => '/texts');
vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockPathname.mockReturnValue('/texts');
});

describe('SidebarNav — рендер', () => {
  it('показывает логотип Flashlang', () => {
    render(<SidebarNav isAdmin={false} />);
    expect(screen.getByText('Flashlang')).toBeInTheDocument();
  });

  it('показывает все основные навигационные ссылки', () => {
    render(<SidebarNav isAdmin={false} />);
    expect(screen.getByText('Тексты')).toBeInTheDocument();
    expect(screen.getByText('Словарь')).toBeInTheDocument();
    expect(screen.getByText('Тренировка')).toBeInTheDocument();
  });

  it('скрывает ссылку «Пользователи» если isAdmin=false', () => {
    render(<SidebarNav isAdmin={false} />);
    expect(screen.queryByText('Пользователи')).not.toBeInTheDocument();
  });

  it('показывает ссылку «Пользователи» если isAdmin=true', () => {
    render(<SidebarNav isAdmin={true} />);
    expect(screen.getByText('Пользователи')).toBeInTheDocument();
  });

  it('не показывает кнопку закрытия если onClose не передан', () => {
    render(<SidebarNav isAdmin={false} />);
    expect(screen.queryByLabelText('Закрыть меню')).not.toBeInTheDocument();
  });

  it('показывает кнопку закрытия если передан onClose', () => {
    render(<SidebarNav isAdmin={false} onClose={vi.fn()} />);
    expect(screen.getByLabelText('Закрыть меню')).toBeInTheDocument();
  });
});

describe('SidebarNav — активная ссылка', () => {
  it('выделяет ссылку «Тексты» при pathname=/texts', () => {
    mockPathname.mockReturnValue('/texts');
    render(<SidebarNav isAdmin={false} />);
    const link = screen.getByText('Тексты').closest('a');
    expect(link).toHaveClass('bg-accent');
  });

  it('не выделяет «Словарь» если pathname=/texts', () => {
    mockPathname.mockReturnValue('/texts');
    render(<SidebarNav isAdmin={false} />);
    const link = screen.getByText('Словарь').closest('a');
    expect(link).not.toHaveClass('bg-accent');
  });

  it('выделяет «Тренировка» при pathname=/training', () => {
    mockPathname.mockReturnValue('/training');
    render(<SidebarNav isAdmin={false} />);
    const link = screen.getByText('Тренировка').closest('a');
    expect(link).toHaveClass('bg-accent');
  });

  it('выделяет вложенный маршрут /texts/123', () => {
    mockPathname.mockReturnValue('/texts/123');
    render(<SidebarNav isAdmin={false} />);
    const link = screen.getByText('Тексты').closest('a');
    expect(link).toHaveClass('bg-accent');
  });

  it('вызывает onClose при клике на ссылку', () => {
    const onClose = vi.fn();
    render(<SidebarNav isAdmin={false} onClose={onClose} />);
    fireEvent.click(screen.getByText('Тексты'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('MobileMenuButton', () => {
  it('рендерится с aria-label', () => {
    render(<MobileMenuButton onClick={vi.fn()} />);
    expect(screen.getByLabelText('Открыть меню')).toBeInTheDocument();
  });

  it('вызывает onClick при клике', () => {
    const onClick = vi.fn();
    render(<MobileMenuButton onClick={onClick} />);
    fireEvent.click(screen.getByTestId('sidebar-toggle'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe('MobileDrawer', () => {
  it('показывает nav-ссылки', () => {
    render(<MobileDrawer isAdmin={false} onClose={vi.fn()} />);
    expect(screen.getByText('Тексты')).toBeInTheDocument();
  });

  it('вызывает onClose при клике на backdrop', () => {
    const onClose = vi.fn();
    render(<MobileDrawer isAdmin={false} onClose={onClose} />);
    const backdrop = document.querySelector('[aria-hidden="true"]');
    fireEvent.click(backdrop!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('показывает sidebar-mobile test id', () => {
    render(<MobileDrawer isAdmin={false} onClose={vi.fn()} />);
    expect(screen.getByTestId('sidebar-mobile')).toBeInTheDocument();
  });
});
