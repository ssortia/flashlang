import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

/** Сырой ответ MyMemory API */
export interface MyMemoryRawResponse {
  responseData: {
    translatedText: string;
    match: number;
  };
  responseStatus: number;
  responseDetails: string;
}

/**
 * Gate для MyMemory API — транспортный слой.
 * Отвечает за HTTP-запрос, таймаут и логирование транспортных ошибок.
 * Возвращает сырой ответ или null — не бросает доменных исключений.
 */
@Injectable()
export class MyMemoryGate {
  private static readonly BASE_URL = 'https://api.mymemory.translated.net/get';
  private static readonly TIMEOUT_MS = 5000;

  constructor(
    @InjectPinoLogger(MyMemoryGate.name)
    private readonly logger: PinoLogger,
  ) {}

  async translate(text: string, langPair: string): Promise<MyMemoryRawResponse | null> {
    const url = new URL(MyMemoryGate.BASE_URL);
    url.searchParams.set('q', text);
    url.searchParams.set('langpair', langPair);

    try {
      const response = await fetch(url.toString(), {
        signal: AbortSignal.timeout(MyMemoryGate.TIMEOUT_MS),
      });

      if (!response.ok) {
        this.logger.error({ status: response.status }, 'MyMemory вернул HTTP-ошибку');
        return null;
      }

      return (await response.json()) as MyMemoryRawResponse;
    } catch (err) {
      this.logger.error({ err }, 'Ошибка транспорта при обращении к MyMemory');
      return null;
    }
  }
}
