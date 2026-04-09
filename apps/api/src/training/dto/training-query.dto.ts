import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class TrainingQueryDto {
  @ApiPropertyOptional({ description: 'ID набора слов (без фильтра — все слова)' })
  @IsOptional()
  @IsString()
  setId?: string;

  @ApiPropertyOptional({ description: 'Максимальное количество слов за сессию', default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
