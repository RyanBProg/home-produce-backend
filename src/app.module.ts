import { Module } from '@nestjs/common';
import { ProducersModule } from './producers/infrastructure/producers.module';
import { ConfigModule } from './config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { EnvVars } from './config/env.schema';
import { AuthModule } from './auth/auth.module';
import { AccountsModule } from './accounts/interface/accounts.module';

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
          autoLoadEntities: true,
          synchronize: !isProd,
          logging: !isProd,
        };
      },
    }),
    ProducersModule,
    ConfigModule,
    AuthModule,
    AccountsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
