import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTextDto {
  @ApiProperty({ description: 'Заголовок текста', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({ description: 'Содержимое текста' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
