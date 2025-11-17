import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import {
  GetProducersParams,
  ProducersService,
} from '../application/producers.service';
import type { GetProducersQueryDto } from '../application/get-producers-query.dto';

@Controller('producers')
export class ProducersController {
  constructor(private readonly producersService: ProducersService) {}

  @Get()
  getProducers(@Query() query: GetProducersQueryDto) {
    return this.producersService.getProducers(this.mapQueryToParams(query));
  }

  @Get(':id')
  getProducer(@Param('id') id: string) {
    return this.producersService.getProducerById(id);
  }

  private mapQueryToParams(query: GetProducersQueryDto): GetProducersParams {
    const approval =
      typeof query.approval === 'string'
        ? this.parseBoolean(query.approval, 'approval')
        : undefined;

    const categories = this.parseCsv(query.categories);
    const tags = this.parseCsv(query.tags);

    const lat = this.parseOptionalNumber(query.lat, 'lat');
    const lng = this.parseOptionalNumber(query.lng, 'lng');
    const radiusKm = this.parseOptionalNumber(query.radiusKm, 'radiusKm');

    const cursor = this.parseOptionalInteger(query.cursor, 'cursor');
    const limit = this.parseOptionalInteger(query.limit, 'limit');

    const geoProvided =
      typeof lat === 'number' ||
      typeof lng === 'number' ||
      typeof radiusKm === 'number';

    return {
      approval,
      categories,
      tags,
      cursor,
      limit,
      geo: geoProvided
        ? {
            lat: lat as number,
            lng: lng as number,
            radiusKm: radiusKm as number,
          }
        : undefined,
    };
  }

  private parseCsv(value?: string) {
    if (!value) {
      return undefined;
    }

    const parts = value
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);

    return parts.length ? parts : undefined;
  }

  private parseBoolean(value: string, label: string) {
    if (value === 'true') {
      return true;
    }

    if (value === 'false') {
      return false;
    }

    throw new BadRequestException(`${label} must be true or false`);
  }

  private parseOptionalNumber(value: string | undefined, label: string) {
    if (typeof value === 'undefined') {
      return undefined;
    }

    const parsed = Number(value);

    if (Number.isNaN(parsed)) {
      throw new BadRequestException(`${label} must be a number`);
    }

    return parsed;
  }

  private parseOptionalInteger(value: string | undefined, label: string) {
    if (typeof value === 'undefined') {
      return undefined;
    }

    const parsed = Number(value);

    if (!Number.isInteger(parsed)) {
      throw new BadRequestException(`${label} must be an integer`);
    }

    return parsed;
  }
}
