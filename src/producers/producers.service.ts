import { Injectable } from '@nestjs/common';
import producer from '../test-data/producer.json';
import producers from '../test-data/producers.json';

@Injectable()
export class ProducersService {
  getProducers(): unknown[] {
    return producers;
  }

  getProducerById(id: string) {
    if (!id) {
      return new Error('id is required');
    }
    return producer;
  }
}
