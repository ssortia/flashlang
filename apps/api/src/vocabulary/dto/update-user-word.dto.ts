import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateUserWordDto {
  @ApiPropertyOptional({ description: 'Новый перевод слова' })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  translation?: string;

  @ApiPropertyOptional({ description: 'Уровень знания (0–5)', minimum: 0, maximum: 5 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  knowledgeLevel?: number;
}
