import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RedisCacheModule } from '@app/common/redis-cashe';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity, UserEntity } from 'src/db/entities';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  imports: [
    TypeOrmModule.forFeature([UserEntity, TransactionEntity]),
    RedisCacheModule,
    CacheModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: configService.get('REDIS_HOST'),
            port: Number(configService.get('REDIS_PORT')),
          },
        }),
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
})
export class UsersModule {}
