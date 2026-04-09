import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { User } from '@prisma/client';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { CreateUserWordDto } from './dto/create-user-word.dto';
import { ListVocabularyQueryDto } from './dto/list-vocabulary-query.dto';
import { UpdateUserWordDto } from './dto/update-user-word.dto';
import { UserWordResponseDto } from './dto/user-word-response.dto';
import { VocabularyListResponseDto } from './dto/vocabulary-list-response.dto';
import { VocabularyService } from './vocabulary.service';

@ApiTags('vocabulary')
@Controller('vocabulary')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VocabularyController {
  constructor(private readonly vocabularyService: VocabularyService) {}

  @Get()
  @ApiOperation({ summary: 'Словарь пользователя с фильтрами и пагинацией' })
  @ApiOkResponse({ type: VocabularyListResponseDto })
  findAll(@Query() query: ListVocabularyQueryDto, @CurrentUser() user: User) {
    return this.vocabularyService.findAll(user.id, query);
  }

  @Post()
  @ApiOperation({ summary: 'Добавить слово в словарь' })
  @ApiCreatedResponse({ type: UserWordResponseDto })
  create(@Body() dto: CreateUserWordDto, @CurrentUser() user: User) {
    return this.vocabularyService.create(user.id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить слово (перевод и/или уровень знания)' })
  @ApiOkResponse({ type: UserWordResponseDto })
  update(@Param('id') id: string, @Body() dto: UpdateUserWordDto, @CurrentUser() user: User) {
    return this.vocabularyService.update(id, user.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить слово из словаря' })
  @ApiNoContentResponse()
  delete(@Param('id') id: string, @CurrentUser() user: User) {
    return this.vocabularyService.delete(id, user.id);
  }
}
