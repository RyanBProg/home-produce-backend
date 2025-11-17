import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ProducersService } from './producers.service';
import { ProducerRepository } from '../domain/producer.repository';
import { PaginatedProducers, Producer } from '../domain/producer';

describe('ProducersService', () => {
  let service: ProducersService;
  let repository: jest.Mocked<ProducerRepository>;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      search: jest.fn(),
    } as unknown as jest.Mocked<ProducerRepository>;
    service = new ProducersService(repository);
  });

  it('returns a producer when found', async () => {
    const producer = createProducer();
    repository.findById.mockResolvedValueOnce(producer);

    const result = await service.getProducerById(producer.id);

    expect(result).toEqual(producer);
  });

  it('throws an error when missing id', async () => {
    await expect(service.getProducerById('')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('throws when producer is missing', async () => {
    repository.findById.mockResolvedValueOnce(null);

    await expect(service.getProducerById('abc')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('passes pagination defaults to repository', async () => {
    const repoResult: PaginatedProducers = {
      data: [],
      nextCursor: undefined,
      config: { cursor: 0, limit: 20 },
    };
    repository.search.mockResolvedValueOnce(repoResult);

    const result = await service.getProducers({});

    expect(repository.search).toHaveBeenCalledWith({
      approval: undefined,
      categories: undefined,
      tags: undefined,
      cursor: 0,
      limit: 20,
      geo: undefined,
    });
    expect(result).toBe(repoResult);
  });

  it('clamps limit and validates cursor', async () => {
    const repoResult: PaginatedProducers = {
      data: [],
      nextCursor: undefined,
      config: { cursor: 5, limit: 50 },
    };
    repository.search.mockResolvedValueOnce(repoResult);

    await service.getProducers({ limit: 120, cursor: 5 });

    expect(repository.search).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 50, cursor: 5 }),
    );
  });

  it('throws when cursor is negative', async () => {
    await expect(service.getProducers({ cursor: -1 })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('throws when geo filter is partially provided', async () => {
    await expect(
      service.getProducers({
        geo: { lat: 10, lng: 20, radiusKm: undefined as any },
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});

function createProducer(): Producer {
  return {
    id: 'id-1',
    name: 'Local Farm',
    description: 'Fresh produce',
    categories: ['honey'],
    tags: ['organic'],
    images: [],
    lat: 0,
    lng: 0,
    suburb: 'Suburb',
    state: 'NSW',
    schedule: [],
    phone: '0400 000 000',
    offersDelivery: false,
    approvalStatus: 'approved',
  };
}
