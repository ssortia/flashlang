import { Injectable } from '@nestjs/common';
import type { UserWord } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TrainingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findWordsForTraining(userId: string, limit: number, setId?: string): Promise<UserWord[]> {
    const words = await this.prisma.userWord.findMany({
      where: {
        userId,
        knowledgeLevel: { lt: 5 },
        // Фильтр по набору через many-to-many связь
        ...(setId && { wordSets: { some: { setId } } }),
      },
    });

    // Случайный порядок на уровне приложения.
    // Приемлемо для типичного размера словаря (< 10 000 слов).
    return shuffleArray(words).slice(0, limit);
  }

  findWordByIdAndUser(id: string, userId: string): Promise<UserWord | null> {
    return this.prisma.userWord.findFirst({ where: { id, userId } });
  }

  updateKnowledgeLevel(id: string, knowledgeLevel: number): Promise<UserWord> {
    return this.prisma.userWord.update({ where: { id }, data: { knowledgeLevel } });
  }
}

/** Fisher-Yates shuffle — случайная перестановка массива без изменения оригинала */
function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}
