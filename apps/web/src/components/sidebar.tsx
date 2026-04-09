'use client';

import { BookOpen, Menu, Users, X, Zap } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/texts', label: 'Тексты', icon: BookOpen },
  { href: '/vocabulary', label: 'Словарь', icon: BookOpen },
  { href: '/training', label: 'Тренировка', icon: Zap },
];

interface SidebarNavProps {
  isAdmin: boolean;
  onClose?: () => void;
}

/** Содержимое навигации (ссылки + лого) — переиспользуется в desktop и mobile */
export function SidebarNav({ isAdmin, onClose }: SidebarNavProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + '/');
  }

  return (
    <div className="flex h-full flex-col" data-testid="sidebar">
      {/* Логотип */}
      <div className="flex h-16 items-center justify-between border-b px-6">
        <Link
          href="/texts"
          className="text-primary text-xl font-bold tracking-tight"
          onClick={onClose}
        >
          Flashlang
        </Link>
        {/* Кнопка закрытия — только в мобильном drawer */}
        {onClose && (
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground md:hidden"
            aria-label="Закрыть меню"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Ссылки */}
      <nav className="flex-1 space-y-1 p-4">
        {NAV_LINKS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive(href)
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}

        {isAdmin && (
          <Link
            href="/admin/users"
            onClick={onClose}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive('/admin')
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
            )}
          >
            <Users className="h-4 w-4 shrink-0" />
            Пользователи
          </Link>
        )}
      </nav>
    </div>
  );
}

interface MobileMenuButtonProps {
  onClick: () => void;
}

/** Кнопка-гамбургер для открытия мобильного меню */
export function MobileMenuButton({ onClick }: MobileMenuButtonProps) {
  return (
    <button
      onClick={onClick}
      className="text-muted-foreground hover:text-foreground md:hidden"
      aria-label="Открыть меню"
      data-testid="sidebar-toggle"
    >
      <Menu className="h-5 w-5" />
    </button>
  );
}

interface MobileDrawerProps {
  isAdmin: boolean;
  onClose: () => void;
}

/** Мобильный drawer с overlay */
export function MobileDrawer({ isAdmin, onClose }: MobileDrawerProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Drawer */}
      <aside
        className="bg-card fixed inset-y-0 left-0 z-50 w-64 border-r md:hidden"
        data-testid="sidebar-mobile"
      >
        <SidebarNav isAdmin={isAdmin} onClose={onClose} />
      </aside>
    </>
  );
}
