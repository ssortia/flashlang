import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddWordToSetDto {
  @ApiProperty({ description: 'ID слова из словаря пользователя' })
  @IsString()
  @IsNotEmpty()
  wordId: string;
}
