import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class TranslateDto {
  @ApiProperty({ description: 'Текст для перевода', maxLength: 500 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  text: string;

  @ApiPropertyOptional({
    description: 'Языковая пара в формате MyMemory (например en|ru)',
    default: 'en|ru',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[a-z]{2}\|[a-z]{2}$/, { message: 'langPair must be in format "xx|xx", e.g. "en|ru"' })
  langPair?: string = 'en|ru';
}
