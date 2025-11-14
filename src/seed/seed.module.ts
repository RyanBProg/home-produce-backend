import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '../config/config.module';
import { EnvVars } from '../config/env.schema';
import { ProducerEntity } from '../producers/producers.entity';

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
          entities: [ProducerEntity],
          synchronize: !isProd,
          logging: !isProd,
        };
      },
    }),
    ConfigModule,
    TypeOrmModule.forFeature([ProducerEntity]),
  ],
  providers: [SeedService],
})
export class SeedModule {}
