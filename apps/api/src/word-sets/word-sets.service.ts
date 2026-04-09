import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import type { CreateWordSetDto } from './dto/create-word-set.dto';
import type { RenameWordSetDto } from './dto/rename-word-set.dto';
import type { WordSetWithCount } from './word-sets.repository';
import { WordSetsRepository } from './word-sets.repository';

@Injectable()
export class WordSetsService {
  constructor(private readonly wordSetsRepository: WordSetsRepository) {}

  findAll(userId: string): Promise<WordSetWithCount[]> {
    return this.wordSetsRepository.findAllByUser(userId);
  }

  create(userId: string, dto: CreateWordSetDto) {
    return this.wordSetsRepository.create({
      name: dto.name,
      user: { connect: { id: userId } },
    });
  }

  async rename(id: string, userId: string, dto: RenameWordSetDto) {
    const set = await this.wordSetsRepository.findByIdAndUser(id, userId);
    if (!set) throw new NotFoundException('Word set not found');
    return this.wordSetsRepository.update(id, { name: dto.name });
  }

  async delete(id: string, userId: string): Promise<void> {
    // findByIdAndUser гарантирует принадлежность набора пользователю — 404 достаточно
    const set = await this.wordSetsRepository.findByIdAndUser(id, userId);
    if (!set) throw new NotFoundException('Word set not found');
    await this.wordSetsRepository.delete(id);
  }

  async addWord(setId: string, userId: string, wordId: string): Promise<void> {
    const set = await this.wordSetsRepository.findByIdAndUser(setId, userId);
    if (!set) throw new NotFoundException('Word set not found');

    const word = await this.wordSetsRepository.wordBelongsToUser(wordId, userId);
    if (!word) throw new NotFoundException('Word not found');

    const already = await this.wordSetsRepository.wordInSet(wordId, setId);
    if (already) throw new ConflictException('Word is already in this set');

    await this.wordSetsRepository.addWordToSet(wordId, setId);
  }

  async removeWord(setId: string, userId: string, wordId: string): Promise<void> {
    const set = await this.wordSetsRepository.findByIdAndUser(setId, userId);
    if (!set) throw new NotFoundException('Word set not found');

    const inSet = await this.wordSetsRepository.wordInSet(wordId, setId);
    if (!inSet) throw new NotFoundException('Word is not in this set');

    await this.wordSetsRepository.removeWordFromSet(wordId, setId);
  }
}
