import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import { milliseconds } from 'date-fns';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        '.env',
        '.env.development',
        '.env.production',
        '.env.test',
        '.env.local',
      ],
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: milliseconds({ seconds: 30 }),
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: milliseconds({ seconds: 60 }),
          limit: 100,
        },
      ],
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
