import { Injectable } from '@nestjs/common';
import type { UserWord } from '@prisma/client';
import { Prisma } from '@prisma/client';

import type { BaseModelDelegate } from '../common/repository/base.repository';
import { BaseRepository } from '../common/repository/base.repository';
import { PrismaService } from '../prisma/prisma.service';

import type { ListVocabularyQueryDto } from './dto/list-vocabulary-query.dto';

@Injectable()
export class VocabularyRepository extends BaseRepository<
  UserWord,
  Prisma.UserWordCreateInput,
  Prisma.UserWordUpdateInput
> {
  constructor(private readonly prisma: PrismaService) {
    super(
      prisma.userWord as unknown as BaseModelDelegate<
        UserWord,
        Prisma.UserWordCreateInput,
        Prisma.UserWordUpdateInput
      >,
    );
  }

  async findAllByUser(
    userId: string,
    query: ListVocabularyQueryDto,
  ): Promise<{ items: UserWord[]; total: number }> {
    const where: Prisma.UserWordWhereInput = { userId };

    if (query.knowledgeLevel !== undefined) {
      where.knowledgeLevel = query.knowledgeLevel;
    }
    if (query.search) {
      where.OR = [
        { word: { contains: query.search, mode: 'insensitive' } },
        { translation: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.dateFrom || query.dateTo) {
      where.createdAt = {
        ...(query.dateFrom && { gte: new Date(query.dateFrom) }),
        ...(query.dateTo && { lte: new Date(query.dateTo) }),
      };
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const [items, total] = await Promise.all([
      this.prisma.userWord.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.userWord.count({ where }),
    ]);

    return { items, total };
  }

  findByIdAndUser(id: string, userId: string): Promise<UserWord | null> {
    return this.prisma.userWord.findFirst({ where: { id, userId } });
  }

  findByWordAndUser(word: string, userId: string): Promise<UserWord | null> {
    return this.prisma.userWord.findUnique({ where: { userId_word: { userId, word } } });
  }

  // Расширяем видимость protected → public для вызова из VocabularyService.
  override create(data: Prisma.UserWordCreateInput): Promise<UserWord> {
    return super.create(data);
  }

  // Расширяем видимость protected → public для вызова из VocabularyService.
  override update(id: string, data: Prisma.UserWordUpdateInput): Promise<UserWord> {
    return super.update(id, data);
  }

  // Расширяем видимость protected → public для вызова из VocabularyService.
  override delete(id: string): Promise<UserWord> {
    return super.delete(id);
  }
}
