import {
  PaginatedProducers,
  Producer,
  ProducerSearchFilters,
} from './producer';

export interface ProducerRepository {
  findById(id: string): Promise<Producer | null>;
  search(filters: ProducerSearchFilters): Promise<PaginatedProducers>;
}
