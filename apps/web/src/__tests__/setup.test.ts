// Базовый тест для проверки работоспособности тестового фреймворка
import { describe, expect, it } from 'vitest';

describe('Тестовый фреймворк', () => {
  it('должен корректно выполнять базовые assertions', () => {
    expect(1 + 1).toBe(2);
  });

  it('должен поддерживать матчеры строк', () => {
    expect('flashlang').toContain('flash');
  });
});
