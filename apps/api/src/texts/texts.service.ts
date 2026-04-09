import { Injectable, NotFoundException } from '@nestjs/common';
import type { Text } from '@prisma/client';

import type { CreateTextDto } from './dto/create-text.dto';
import type { ListTextsQueryDto } from './dto/list-texts-query.dto';
import { TextsRepository } from './texts.repository';

@Injectable()
export class TextsService {
  constructor(private readonly textsRepository: TextsRepository) {}

  findAllByUser(
    userId: string,
    query: ListTextsQueryDto,
  ): Promise<{ items: Text[]; total: number }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    return this.textsRepository.findAllByUser(userId, page, limit);
  }

  async findOne(id: string, userId: string): Promise<Text> {
    const text = await this.textsRepository.findByIdAndUser(id, userId);
    if (!text) throw new NotFoundException('Text not found');
    return text;
  }

  create(userId: string, dto: CreateTextDto): Promise<Text> {
    return this.textsRepository.create({
      title: dto.title,
      content: dto.content,
      user: { connect: { id: userId } },
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    // findByIdAndUser гарантирует принадлежность тексту пользователю — 404 достаточно
    const text = await this.textsRepository.findByIdAndUser(id, userId);
    if (!text) throw new NotFoundException('Text not found');
    await this.textsRepository.delete(id);
  }
}
