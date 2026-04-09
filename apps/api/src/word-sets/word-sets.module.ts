import { Module } from '@nestjs/common';

import { WordSetsController } from './word-sets.controller';
import { WordSetsRepository } from './word-sets.repository';
import { WordSetsService } from './word-sets.service';

@Module({
  controllers: [WordSetsController],
  providers: [WordSetsRepository, WordSetsService],
  exports: [WordSetsService],
})
export class WordSetsModule {}
