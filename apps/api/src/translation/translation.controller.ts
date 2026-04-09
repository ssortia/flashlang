import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { TranslateDto } from './dto/translate.dto';
import { TranslationResponseDto } from './dto/translation-response.dto';
import { TranslationService } from './translation.service';

@ApiTags('translation')
@Controller('translation')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Перевести слово или фразу через MyMemory API' })
  @ApiOkResponse({ type: TranslationResponseDto })
  translate(@Body() dto: TranslateDto): Promise<TranslationResponseDto> {
    return this.translationService.translate(dto.text, dto.langPair!);
  }
}
