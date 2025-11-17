export interface GetProducersQueryDto {
  approval?: string;
  categories?: string;
  tags?: string;
  lat?: string;
  lng?: string;
  radiusKm?: string;
  cursor?: string;
  limit?: string;
}
