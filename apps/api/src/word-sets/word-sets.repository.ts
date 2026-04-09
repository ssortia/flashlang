import { Injectable } from '@nestjs/common';
import type { WordSet } from '@prisma/client';
import { Prisma } from '@prisma/client';

import type { BaseModelDelegate } from '../common/repository/base.repository';
import { BaseRepository } from '../common/repository/base.repository';
import { PrismaService } from '../prisma/prisma.service';

export type WordSetWithCount = WordSet & { wordCount: number };

@Injectable()
export class WordSetsRepository extends BaseRepository<
  WordSet,
  Prisma.WordSetCreateInput,
  Prisma.WordSetUpdateInput
> {
  constructor(private readonly prisma: PrismaService) {
    super(
      prisma.wordSet as unknown as BaseModelDelegate<
        WordSet,
        Prisma.WordSetCreateInput,
        Prisma.WordSetUpdateInput
      >,
    );
  }

  async findAllByUser(userId: string): Promise<WordSetWithCount[]> {
    const sets = await this.prisma.wordSet.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { words: true } } },
    });

    return sets.map(({ _count, ...set }) => ({ ...set, wordCount: _count.words }));
  }

  findByIdAndUser(id: string, userId: string): Promise<WordSet | null> {
    return this.prisma.wordSet.findFirst({ where: { id, userId } });
  }

  wordBelongsToUser(wordId: string, userId: string): Promise<{ id: string } | null> {
    return this.prisma.userWord.findFirst({ where: { id: wordId, userId }, select: { id: true } });
  }

  wordInSet(wordId: string, setId: string): Promise<{ wordId: string } | null> {
    return this.prisma.userWordOnSet.findUnique({ where: { wordId_setId: { wordId, setId } } });
  }

  addWordToSet(wordId: string, setId: string): Promise<void> {
    return this.prisma.userWordOnSet.create({ data: { wordId, setId } }).then(() => undefined);
  }

  removeWordFromSet(wordId: string, setId: string): Promise<void> {
    return this.prisma.userWordOnSet
      .delete({ where: { wordId_setId: { wordId, setId } } })
      .then(() => undefined);
  }

  // Расширяем видимость protected → public для вызова из WordSetsService.
  override create(data: Prisma.WordSetCreateInput): Promise<WordSet> {
    return super.create(data);
  }

  // Расширяем видимость protected → public для вызова из WordSetsService.
  override update(id: string, data: Prisma.WordSetUpdateInput): Promise<WordSet> {
    return super.update(id, data);
  }

  // Расширяем видимость protected → public для вызова из WordSetsService.
  override delete(id: string): Promise<WordSet> {
    return super.delete(id);
  }
}
