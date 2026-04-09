import type { Metadata } from 'next';

import { RegisterForm } from '../../../components/auth/register-form';

export const metadata: Metadata = { title: 'Регистрация | Flashlang' };

export default function RegisterPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center gap-6">
      <span className="text-primary text-3xl font-bold tracking-tight">Flashlang</span>
      <RegisterForm />
    </div>
  );
}
