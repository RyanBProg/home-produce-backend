import { Controller, Get, Param } from '@nestjs/common';
import { ProducersService } from './producers.service';

@Controller('producers')
export class ProducersController {
  constructor(private readonly producersService: ProducersService) {}

  @Get()
  getProducers() {
    return this.producersService.getProducers();
  }

  @Get(':id')
  getProducer(@Param('id') id: string) {
    try {
      const res = this.producersService.getProducerById(id);
      return res;
    } catch (error) {
      return error;
    }
  }
}
