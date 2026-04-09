import { ApiProperty } from '@nestjs/swagger';

import { TextResponseDto } from './text-response.dto';

export class TextListResponseDto {
  @ApiProperty({ type: [TextResponseDto] })
  items: TextResponseDto[];

  @ApiProperty()
  total: number;
}
