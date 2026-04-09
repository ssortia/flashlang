import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class TrainingResultDto {
  @ApiProperty({ description: 'ID слова из словаря' })
  @IsString()
  @IsNotEmpty()
  wordId: string;

  @ApiProperty({ description: 'true — знал слово (+1), false — не знал (-1)' })
  @IsBoolean()
  correct: boolean;
}
