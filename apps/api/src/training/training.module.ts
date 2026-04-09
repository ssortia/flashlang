import { Module } from '@nestjs/common';

import { TrainingController } from './training.controller';
import { TrainingRepository } from './training.repository';
import { TrainingService } from './training.service';

@Module({
  controllers: [TrainingController],
  providers: [TrainingRepository, TrainingService],
})
export class TrainingModule {}
