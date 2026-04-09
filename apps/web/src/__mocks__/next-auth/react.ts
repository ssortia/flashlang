// Мок для next-auth/react — используется в тестах вместо реального модуля
import { vi } from 'vitest';

export const useSession = vi.fn(() => ({
  data: {
    accessToken: 'test-token',
    user: { id: '1', email: 'test@example.com', name: 'Test User' },
  },
  status: 'authenticated',
}));

export const signIn = vi.fn();
export const signOut = vi.fn();
export const SessionProvider = ({ children }: { children: React.ReactNode }) => children;
