import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  PaginatedProducers,
  Producer,
  ProducerSearchFilters,
} from '../domain/producer';
import { ProducerRepository } from '../domain/producer.repository';
import { ProducerEntity } from '../producers.entity';

@Injectable()
export class ProducerTypeOrmRepository implements ProducerRepository {
  constructor(
    @InjectRepository(ProducerEntity)
    private readonly repository: Repository<ProducerEntity>,
  ) {}

  async findById(id: string): Promise<Producer | null> {
    const producer = await this.repository.findOne({ where: { id } });
    return producer ? this.toDomain(producer) : null;
  }

  async search(filters: ProducerSearchFilters): Promise<PaginatedProducers> {
    const qb = this.repository.createQueryBuilder('producer');

    if (filters.approval === true) {
      qb.andWhere('producer.approvalStatus = :approved', {
        approved: 'approved',
      });
    } else if (filters.approval === false) {
      qb.andWhere('producer.approvalStatus != :approved', {
        approved: 'approved',
      });
    }

    if (filters.categories?.length) {
      qb.andWhere('producer.categories && :categories', {
        categories: filters.categories,
      });
    }

    if (filters.tags?.length) {
      qb.andWhere('producer.tags && :tags', { tags: filters.tags });
    }

    if (filters.geo) {
      const { lat, lng, radiusKm } = filters.geo;
      const distanceExpression =
        '(6371 * acos(cos(radians(:lat)) * cos(radians(producer.lat)) * cos(radians(producer.lng) - radians(:lng)) + sin(radians(:lat)) * sin(radians(producer.lat))))';

      qb.addSelect(distanceExpression, 'distanceKm');
      qb.andWhere(`${distanceExpression} <= :radiusKm`, {
        lat,
        lng,
        radiusKm,
      });
      qb.orderBy('distanceKm', 'ASC').addOrderBy('producer.name', 'ASC');
    } else {
      qb.orderBy('producer.name', 'ASC');
    }

    const cursor = filters.cursor ?? 0;
    qb.skip(cursor);
    qb.take(filters.limit);

    const result = await qb.getMany();
    const data = result.map((producer) => this.toDomain(producer));

    const nextCursor =
      data.length === filters.limit ? cursor + data.length : undefined;

    return {
      data,
      nextCursor,
      config: { limit: filters.limit, cursor },
    };
  }

  private toDomain(entity: ProducerEntity): Producer {
    return {
      id: entity.id,
      name: entity.name,
      highlight: entity.highlight ?? undefined,
      description: entity.description,
      categories: entity.categories ?? [],
      tags: entity.tags ?? [],
      images: entity.images ?? [],
      lat: typeof entity.lat === 'number' ? entity.lat : Number(entity.lat),
      lng: typeof entity.lng === 'number' ? entity.lng : Number(entity.lng),
      suburb: entity.suburb,
      state: entity.state,
      schedule: entity.schedule ?? [],
      phone: entity.phone,
      website: entity.website ?? undefined,
      offersDelivery: entity.offersDelivery,
      approvalStatus: entity.approvalStatus,
    };
  }
}
