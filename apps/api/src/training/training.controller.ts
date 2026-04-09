import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { User } from '@prisma/client';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { TrainingQueryDto } from './dto/training-query.dto';
import { TrainingResultDto } from './dto/training-result.dto';
import { TrainingWordResponseDto } from './dto/training-word-response.dto';
import { TrainingService } from './training.service';

@ApiTags('training')
@Controller('training')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  @Get('words')
  @ApiOperation({ summary: 'Слова для тренировки (knowledgeLevel < 5, случайный порядок)' })
  @ApiOkResponse({ type: [TrainingWordResponseDto] })
  getWords(@Query() query: TrainingQueryDto, @CurrentUser() user: User) {
    return this.trainingService.getWords(user.id, query);
  }

  @Post('result')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Записать результат: +1 за верный ответ, -1 за неверный' })
  @ApiOkResponse({ type: TrainingWordResponseDto })
  recordResult(@Body() dto: TrainingResultDto, @CurrentUser() user: User) {
    return this.trainingService.recordResult(user.id, dto);
  }
}
