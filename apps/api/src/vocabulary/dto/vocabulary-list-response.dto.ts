import { ApiProperty } from '@nestjs/swagger';

import { UserWordResponseDto } from './user-word-response.dto';

export class VocabularyListResponseDto {
  @ApiProperty({ type: [UserWordResponseDto] })
  items: UserWordResponseDto[];

  @ApiProperty()
  total: number;
}
