import { Injectable, NotFoundException } from '@nestjs/common';
import type { UserWord } from '@prisma/client';

import type { TrainingQueryDto } from './dto/training-query.dto';
import type { TrainingResultDto } from './dto/training-result.dto';
import { TrainingRepository } from './training.repository';

const MAX_KNOWLEDGE_LEVEL = 5;
const MIN_KNOWLEDGE_LEVEL = 0;

@Injectable()
export class TrainingService {
  constructor(private readonly trainingRepository: TrainingRepository) {}

  getWords(userId: string, query: TrainingQueryDto): Promise<UserWord[]> {
    return this.trainingRepository.findWordsForTraining(userId, query.limit ?? 20, query.setId);
  }

  async recordResult(userId: string, dto: TrainingResultDto): Promise<UserWord> {
    const word = await this.trainingRepository.findWordByIdAndUser(dto.wordId, userId);
    if (!word) throw new NotFoundException('Word not found');

    const delta = dto.correct ? 1 : -1;
    const newLevel = Math.min(
      MAX_KNOWLEDGE_LEVEL,
      Math.max(MIN_KNOWLEDGE_LEVEL, word.knowledgeLevel + delta),
    );

    return this.trainingRepository.updateKnowledgeLevel(word.id, newLevel);
  }
}
