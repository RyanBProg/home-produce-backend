import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProducersController } from './producers.controller';
import { ProducersService } from '../application/producers.service';
import { ProducerEntity } from '../producers.entity';
import { ProducerTypeOrmRepository } from './producer-typeorm.repository';
import { PRODUCER_REPOSITORY } from '../tokens';

@Module({
  imports: [TypeOrmModule.forFeature([ProducerEntity])],
  controllers: [ProducersController],
  providers: [
    ProducersService,
    ProducerTypeOrmRepository,
    {
      provide: PRODUCER_REPOSITORY,
      useExisting: ProducerTypeOrmRepository,
    },
  ],
  exports: [ProducersService],
})
export class ProducersModule {}
