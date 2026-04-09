import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    // Используем jsdom для эмуляции браузерного окружения
    environment: 'jsdom',
    // Файл с глобальными настройками тестов
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      // Псевдоним для импортов @/* → src/*
      '@': resolve(__dirname, './src'),
      // Мок для next/navigation чтобы не падало в тестах
      'next/navigation': resolve(__dirname, './src/__mocks__/next/navigation.ts'),
      // Мок для next-auth/react
      'next-auth/react': resolve(__dirname, './src/__mocks__/next-auth/react.ts'),
    },
  },
});
