import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';

export const RedisConfigService = () => ({
  useFactory: async (configService: ConfigService) => ({
    store: await redisStore({
      socket: {
        host: configService.get('REDIS_HOST'),
        port: Number(configService.get('REDIS_PORT')),
      },
    }),
  }),
  inject: [ConfigService],
  imports: [ConfigModule],
});

// type: 'postgres',
//     host: configService.get('PS_HOST'),
//     port: Number(configService.get('PS_PORT')),
//     username: configService.get('PS_USER'),
//     password: configService.get('PS_PASSWORD'),
//     database: configService.get('PS_DB_NAME'),
//     entities: ENTITES,
//     autoLoadEntities: Boolean(configService.get('SYNC_DB') === 'true') || false,
//     synchronize: Boolean(configService.get('SYNC_DB') === 'true') || false,
//     logger: 'simple-console',
//     logging: Boolean(configService.get('TYPEORM_LOGGING') === 'true') || false,

// host: configService.get('REDIS_HOST'),
// port: Number(configService.get('REDIS_PORT')),
