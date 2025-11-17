import { ProducersController } from './producers.controller';
import { ProducersService } from '../application/producers.service';

describe('ProducersController', () => {
  let controller: ProducersController;
  let service: jest.Mocked<ProducersService>;

  beforeEach(() => {
    service = {
      getProducers: jest.fn(),
      getProducerById: jest.fn(),
    } as unknown as jest.Mocked<ProducersService>;
    controller = new ProducersController(service);
  });

  it('proxies request to service with parsed filters', async () => {
    service.getProducers.mockResolvedValueOnce({
      data: [],
      config: { cursor: 0, limit: 20 },
    });

    await controller.getProducers({
      approval: 'true',
      categories: 'honey,mushrooms',
      tags: 'organic',
      lat: '53.34',
      lng: '-6.26',
      radiusKm: '25',
      cursor: '1',
      limit: '20',
    });

    expect(service.getProducers).toHaveBeenCalledWith({
      approval: true,
      categories: ['honey', 'mushrooms'],
      tags: ['organic'],
      cursor: 1,
      limit: 20,
      geo: { lat: 53.34, lng: -6.26, radiusKm: 25 },
    });
  });

  it('delegates to service for single producer lookups', async () => {
    const producer = { id: 'test', name: 'Farm', description: 'desc' } as any;
    service.getProducerById.mockResolvedValueOnce(producer);

    const result = await controller.getProducer('test');

    expect(service.getProducerById).toHaveBeenCalledWith('test');
    expect(result).toBe(producer);
  });
});
