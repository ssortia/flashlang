'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/texts', label: 'Тексты' },
  { href: '/vocabulary', label: 'Словарь' },
  { href: '/training', label: 'Тренировка' },
];

interface NavProps {
  isAdmin: boolean;
}

export function Nav({ isAdmin }: NavProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + '/');
  }

  return (
    <nav className="flex items-center gap-4">
      {NAV_LINKS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            'text-sm transition-colors',
            isActive(href)
              ? 'text-foreground font-medium'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {label}
        </Link>
      ))}
      {isAdmin && (
        <Link
          href="/admin/users"
          className={cn(
            'text-sm transition-colors',
            isActive('/admin')
              ? 'text-foreground font-medium'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          Пользователи
        </Link>
      )}
    </nav>
  );
}
