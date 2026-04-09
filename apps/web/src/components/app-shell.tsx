'use client';

import { useState } from 'react';

import { MobileDrawer, MobileMenuButton, SidebarNav } from './sidebar';

interface AppShellProps {
  isAdmin: boolean;
  email: string;
  themeToggle: React.ReactNode;
  signOutForm: React.ReactNode;
  children: React.ReactNode;
}

/**
 * AppShell — обёртка dashboard-layout.
 * Client Component: управляет состоянием мобильного меню.
 * Server Components (children, themeToggle, signOutForm) передаются как пропсы.
 */
export function AppShell({ isAdmin, email, themeToggle, signOutForm, children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="bg-background flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="bg-card hidden w-64 shrink-0 border-r md:block">
        <SidebarNav isAdmin={isAdmin} />
      </aside>

      {/* Мобильный drawer (условно) */}
      {mobileOpen && <MobileDrawer isAdmin={isAdmin} onClose={() => setMobileOpen(false)} />}

      {/* Основная область */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center border-b px-4 md:px-6">
          {/* Гамбургер + лого на мобиле */}
          <div className="flex items-center gap-3 md:hidden">
            <MobileMenuButton onClick={() => setMobileOpen(true)} />
            <span className="text-primary text-lg font-bold">Flashlang</span>
          </div>

          {/* Правая часть header */}
          <div className="ml-auto flex items-center gap-4">
            {themeToggle}
            <span className="text-muted-foreground hidden text-sm sm:block">{email}</span>
            {signOutForm}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
