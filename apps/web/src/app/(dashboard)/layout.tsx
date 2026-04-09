import { redirect } from 'next/navigation';

import { AppShell } from '@/components/app-shell';
import { RoleProvider } from '@/components/auth/role-provider';
import { ThemeToggle } from '@/components/theme-toggle';

import { auth, signOut } from '../../auth';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session || session.error === 'RefreshAccessTokenError') {
    redirect('/login');
  }

  const isAdmin = session.user.role === 'ADMIN';

  // Форма выхода — Server Action, передаётся в AppShell как React-узел
  const signOutForm = (
    <form
      action={async () => {
        'use server';
        await signOut({ redirectTo: '/login' });
      }}
    >
      <button
        type="submit"
        className="text-muted-foreground hover:text-foreground text-sm transition-colors"
      >
        Выйти
      </button>
    </form>
  );

  return (
    <RoleProvider role={session.user.role}>
      <AppShell
        isAdmin={isAdmin}
        email={session.user?.email ?? ''}
        themeToggle={<ThemeToggle />}
        signOutForm={signOutForm}
      >
        {children}
      </AppShell>
    </RoleProvider>
  );
}
