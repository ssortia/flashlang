import { Module } from '@nestjs/common';

import { VocabularyController } from './vocabulary.controller';
import { VocabularyRepository } from './vocabulary.repository';
import { VocabularyService } from './vocabulary.service';

@Module({
  controllers: [VocabularyController],
  providers: [VocabularyRepository, VocabularyService],
  exports: [VocabularyService],
})
export class VocabularyModule {}
