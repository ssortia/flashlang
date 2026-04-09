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

import { AddWordToSetDto } from './dto/add-word-to-set.dto';
import { CreateWordSetDto } from './dto/create-word-set.dto';
import { RenameWordSetDto } from './dto/rename-word-set.dto';
import { WordSetResponseDto } from './dto/word-set-response.dto';
import { WordSetsService } from './word-sets.service';

@ApiTags('word-sets')
@Controller('word-sets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WordSetsController {
  constructor(private readonly wordSetsService: WordSetsService) {}

  @Get()
  @ApiOperation({ summary: 'Список наборов слов пользователя' })
  @ApiOkResponse({ type: [WordSetResponseDto] })
  findAll(@CurrentUser() user: User) {
    return this.wordSetsService.findAll(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Создать набор слов' })
  @ApiCreatedResponse({ type: WordSetResponseDto })
  create(@Body() dto: CreateWordSetDto, @CurrentUser() user: User) {
    return this.wordSetsService.create(user.id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Переименовать набор' })
  @ApiOkResponse({ type: WordSetResponseDto })
  rename(@Param('id') id: string, @Body() dto: RenameWordSetDto, @CurrentUser() user: User) {
    return this.wordSetsService.rename(id, user.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить набор (слова из словаря не удаляются)' })
  @ApiNoContentResponse()
  delete(@Param('id') id: string, @CurrentUser() user: User) {
    return this.wordSetsService.delete(id, user.id);
  }

  @Post(':id/words')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Добавить слово в набор' })
  @ApiNoContentResponse()
  addWord(@Param('id') id: string, @Body() dto: AddWordToSetDto, @CurrentUser() user: User) {
    return this.wordSetsService.addWord(id, user.id, dto.wordId);
  }

  @Delete(':id/words/:wordId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Убрать слово из набора' })
  @ApiNoContentResponse()
  removeWord(@Param('id') id: string, @Param('wordId') wordId: string, @CurrentUser() user: User) {
    return this.wordSetsService.removeWord(id, user.id, wordId);
  }
}
