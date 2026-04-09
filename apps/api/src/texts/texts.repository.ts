import { Injectable } from '@nestjs/common';
import type { Text } from '@prisma/client';
import { Prisma } from '@prisma/client';

import type { BaseModelDelegate } from '../common/repository/base.repository';
import { BaseRepository } from '../common/repository/base.repository';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TextsRepository extends BaseRepository<
  Text,
  Prisma.TextCreateInput,
  Prisma.TextUpdateInput
> {
  constructor(private readonly prisma: PrismaService) {
    super(
      prisma.text as unknown as BaseModelDelegate<
        Text,
        Prisma.TextCreateInput,
        Prisma.TextUpdateInput
      >,
    );
  }

  async findAllByUser(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{ items: Text[]; total: number }> {
    const where = { userId };
    const [items, total] = await Promise.all([
      this.prisma.text.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.text.count({ where }),
    ]);
    return { items, total };
  }

  findByIdAndUser(id: string, userId: string): Promise<Text | null> {
    return this.prisma.text.findFirst({ where: { id, userId } });
  }

  // Расширяем видимость protected → public для вызова из TextsService.
  override create(data: Prisma.TextCreateInput): Promise<Text> {
    return super.create(data);
  }

  // Расширяем видимость protected → public для вызова из TextsService.
  override delete(id: string): Promise<Text> {
    return super.delete(id);
  }
}
