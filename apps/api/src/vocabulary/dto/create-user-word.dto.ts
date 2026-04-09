import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateUserWordDto {
  @ApiProperty({ description: 'Слово на английском', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  word: string;

  @ApiProperty({ description: 'Перевод слова' })
  @IsString()
  @IsNotEmpty()
  translation: string;

  @ApiPropertyOptional({ description: 'Уровень знания (0–5)', minimum: 0, maximum: 5, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  knowledgeLevel?: number = 0;

  @ApiPropertyOptional({ description: 'ID текста-источника' })
  @IsOptional()
  @IsString()
  textId?: string;
}
