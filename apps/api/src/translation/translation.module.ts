import { Module } from '@nestjs/common';

import { MyMemoryGate } from './my-memory.gate';
import { TranslationController } from './translation.controller';
import { TranslationService } from './translation.service';

@Module({
  controllers: [TranslationController],
  providers: [MyMemoryGate, TranslationService],
  exports: [TranslationService],
})
export class TranslationModule {}
