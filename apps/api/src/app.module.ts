import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { TextsModule } from './texts/texts.module';
import { TranslationModule } from './translation/translation.module';
import { UsersModule } from './users/users.module';
import { VocabularyModule } from './vocabulary/vocabulary.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env['NODE_ENV'] !== 'production'
            ? { target: 'pino-pretty', options: { colorize: true } }
            : undefined,
      },
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    TextsModule,
    TranslationModule,
    VocabularyModule,
    HealthModule,
  ],
})
export class AppModule {}
