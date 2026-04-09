import type { Metadata } from 'next';

import { LoginForm } from '../../../components/auth/login-form';

export const metadata: Metadata = {
  title: 'Войти | Flashlang',
};

export default function LoginPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center gap-6">
      <span className="text-primary text-3xl font-bold tracking-tight">Flashlang</span>
      <LoginForm />
    </div>
  );
}
