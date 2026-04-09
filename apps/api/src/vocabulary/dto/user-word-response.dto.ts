import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserWordResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiPropertyOptional()
  textId: string | null;

  @ApiProperty()
  word: string;

  @ApiProperty()
  translation: string;

  @ApiProperty({ minimum: 0, maximum: 5 })
  knowledgeLevel: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
