import { ApiProperty } from '@nestjs/swagger';

export class TrainingWordResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  word: string;

  @ApiProperty()
  translation: string;

  @ApiProperty({ minimum: 0, maximum: 5 })
  knowledgeLevel: number;
}
