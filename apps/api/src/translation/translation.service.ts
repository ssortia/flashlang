import { Injectable, InternalServerErrorException } from '@nestjs/common';

import type { TranslationResponseDto } from './dto/translation-response.dto';
import { MyMemoryGate } from './my-memory.gate';

@Injectable()
export class TranslationService {
  constructor(private readonly myMemoryGate: MyMemoryGate) {}

  async translate(text: string, langPair: string): Promise<TranslationResponseDto> {
    const raw = await this.myMemoryGate.translate(text, langPair);

    if (!raw || raw.responseStatus !== 200) {
      throw new InternalServerErrorException('Translation service unavailable');
    }

    return {
      translatedText: raw.responseData.translatedText,
      originalText: text,
      langPair,
    };
  }
}
