import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProducerEntity } from '../producers/producers.entity';
import seedDataJson from './seed-data.json';
import {
  ProducerScheduleDays,
  ApprovalStatus,
} from '../producers/producers.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(ProducerEntity)
    private readonly producerRepository: Repository<ProducerEntity>,
  ) {}

  async run() {
    // Clear existing data
    await this.producerRepository.clear();

    // Type the json data
    const seedData = seedDataJson.map((producer) => ({
      ...producer,
      schedule: producer.schedule.map((slot) => ({
        ...slot,
        day: slot.day as ProducerScheduleDays,
      })),
      approvalStatus: producer.approvalStatus as ApprovalStatus,
    }));

    // Seed new data
    await this.producerRepository.save(seedData);
  }
}
