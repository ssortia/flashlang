import { Module } from '@nestjs/common';

import { TextsController } from './texts.controller';
import { TextsRepository } from './texts.repository';
import { TextsService } from './texts.service';

@Module({
  controllers: [TextsController],
  providers: [TextsRepository, TextsService],
  exports: [TextsService],
})
export class TextsModule {}
