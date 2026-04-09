import { ApiProperty } from '@nestjs/swagger';

export class WordSetResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ description: 'Количество слов в наборе' })
  wordCount: number;

  @ApiProperty()
  createdAt: Date;
}
