import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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

import { CreateTextDto } from './dto/create-text.dto';
import { ListTextsQueryDto } from './dto/list-texts-query.dto';
import { TextListResponseDto } from './dto/text-list-response.dto';
import { TextResponseDto } from './dto/text-response.dto';
import { TextsService } from './texts.service';

@ApiTags('texts')
@Controller('texts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TextsController {
  constructor(private readonly textsService: TextsService) {}

  @Get()
  @ApiOperation({ summary: 'Список текстов текущего пользователя (с пагинацией)' })
  @ApiOkResponse({ type: TextListResponseDto })
  findAll(@Query() query: ListTextsQueryDto, @CurrentUser() user: User) {
    return this.textsService.findAllByUser(user.id, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить текст по ID' })
  @ApiOkResponse({ type: TextResponseDto })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.textsService.findOne(id, user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Создать текст' })
  @ApiCreatedResponse({ type: TextResponseDto })
  create(@Body() dto: CreateTextDto, @CurrentUser() user: User) {
    return this.textsService.create(user.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить текст' })
  @ApiNoContentResponse()
  delete(@Param('id') id: string, @CurrentUser() user: User) {
    return this.textsService.delete(id, user.id);
  }
}
