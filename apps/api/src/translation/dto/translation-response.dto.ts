import { ApiProperty } from '@nestjs/swagger';

export class TranslationResponseDto {
  @ApiProperty({ description: 'Переведённый текст' })
  translatedText: string;

  @ApiProperty({ description: 'Исходный текст' })
  originalText: string;

  @ApiProperty({ description: 'Языковая пара' })
  langPair: string;
}
