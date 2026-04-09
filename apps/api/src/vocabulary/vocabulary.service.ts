import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type { UserWord } from '@prisma/client';

import type { CreateUserWordDto } from './dto/create-user-word.dto';
import type { ListVocabularyQueryDto } from './dto/list-vocabulary-query.dto';
import type { UpdateUserWordDto } from './dto/update-user-word.dto';
import { VocabularyRepository } from './vocabulary.repository';

@Injectable()
export class VocabularyService {
  constructor(private readonly vocabularyRepository: VocabularyRepository) {}

  findAll(
    userId: string,
    query: ListVocabularyQueryDto,
  ): Promise<{ items: UserWord[]; total: number }> {
    return this.vocabularyRepository.findAllByUser(userId, query);
  }

  async create(userId: string, dto: CreateUserWordDto): Promise<UserWord> {
    const existing = await this.vocabularyRepository.findByWordAndUser(dto.word, userId);
    if (existing) throw new ConflictException(`Word "${dto.word}" is already in your vocabulary`);

    return this.vocabularyRepository.create({
      word: dto.word,
      translation: dto.translation,
      knowledgeLevel: dto.knowledgeLevel!,
      user: { connect: { id: userId } },
      ...(dto.textId && { text: { connect: { id: dto.textId } } }),
    });
  }

  async update(id: string, userId: string, dto: UpdateUserWordDto): Promise<UserWord> {
    const word = await this.vocabularyRepository.findByIdAndUser(id, userId);
    if (!word) throw new NotFoundException('Word not found');

    return this.vocabularyRepository.update(id, {
      ...(dto.translation !== undefined && { translation: dto.translation }),
      ...(dto.knowledgeLevel !== undefined && { knowledgeLevel: dto.knowledgeLevel }),
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    // findByIdAndUser гарантирует принадлежность слова пользователю — 404 достаточно
    const word = await this.vocabularyRepository.findByIdAndUser(id, userId);
    if (!word) throw new NotFoundException('Word not found');
    await this.vocabularyRepository.delete(id);
  }
}
