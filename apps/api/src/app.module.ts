import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { TextsModule } from './texts/texts.module';
import { TrainingModule } from './training/training.module';
import { TranslationModule } from './translation/translation.module';
import { UsersModule } from './users/users.module';
import { VocabularyModule } from './vocabulary/vocabulary.module';
import { WordSetsModule } from './word-sets/word-sets.module';

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
    WordSetsModule,
    TrainingModule,
    HealthModule,
  ],
})
export class AppModule {}
