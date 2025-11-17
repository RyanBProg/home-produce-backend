import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { ProducerRepository } from '../domain/producer.repository';
import { PaginatedProducers, Producer } from '../domain/producer';
import { PRODUCER_REPOSITORY } from '../tokens';

export interface GetProducersParams {
  approval?: boolean;
  categories?: string[];
  tags?: string[];
  limit?: number;
  cursor?: number;
  geo?: {
    lat: number;
    lng: number;
    radiusKm: number;
  };
}

@Injectable()
export class ProducersService {
  constructor(
    @Inject(PRODUCER_REPOSITORY)
    private readonly producerRepository: ProducerRepository,
  ) {}

  async getProducers(params: GetProducersParams): Promise<PaginatedProducers> {
    const limit = this.resolveLimit(params.limit);
    const cursor = this.resolveCursor(params.cursor);
    const geo = this.resolveGeo(params.geo);

    return this.producerRepository.search({
      approval: params.approval,
      categories: params.categories,
      tags: params.tags,
      cursor,
      limit,
      geo,
    });
  }

  async getProducerById(id: string): Promise<Producer> {
    if (!id) {
      throw new BadRequestException('id is required');
    }

    const producer = await this.producerRepository.findById(id);

    if (!producer) {
      throw new NotFoundException('Producer not found');
    }

    return producer;
  }

  private resolveLimit(limit?: number): number {
    const fallback = 20;
    if (typeof limit === 'undefined' || Number.isNaN(limit)) {
      return fallback;
    }

    if (limit < 1) {
      throw new BadRequestException('limit must be greater than 0');
    }

    return Math.min(limit, 50);
  }

  private resolveCursor(cursor?: number): number {
    if (typeof cursor === 'undefined' || Number.isNaN(cursor)) {
      return 0;
    }

    if (cursor < 0) {
      throw new BadRequestException('cursor must be a positive number');
    }

    return cursor;
  }

  private resolveGeo(
    geo?: GetProducersParams['geo'],
  ): GetProducersParams['geo'] | undefined {
    if (!geo) {
      return undefined;
    }

    const { lat, lng, radiusKm } = geo;
    const hasLat = typeof lat === 'number' && !Number.isNaN(lat);
    const hasLng = typeof lng === 'number' && !Number.isNaN(lng);
    const hasRadius = typeof radiusKm === 'number' && !Number.isNaN(radiusKm);

    if ((hasLat || hasLng || hasRadius) && !(hasLat && hasLng && hasRadius)) {
      throw new BadRequestException(
        'lat, lng and radiusKm are required to filter by distance',
      );
    }

    if (!hasLat) {
      return undefined;
    }

    if (radiusKm <= 0) {
      throw new BadRequestException('radiusKm must be greater than 0');
    }

    return geo;
  }
}
