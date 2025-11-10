import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvVars } from '../config/env.schema';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvVars, true>) => {
        const env = config.get('NODE_ENV', { infer: true });
        const isProd = env === 'prod';
        const url = isProd
          ? config.get('SUPABASE_DB_URL', { infer: true })
          : config.get('LOCAL_DB_URL', { infer: true });

        return {
          type: 'postgres',
          url,
          synchronize: !isProd,
          logging: !isProd,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
