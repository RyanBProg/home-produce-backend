export type ProducerScheduleDays =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface ProducerSchedule {
  day: ProducerScheduleDays;
  open: string;
  closed: string;
}

export interface Producer {
  id: string;
  name: string;
  highlight?: string;
  description: string;
  categories: string[];
  tags: string[];
  images: string[];
  lat: number;
  lng: number;
  suburb: string;
  state: string;
  schedule: ProducerSchedule[];
  phone: string;
  website?: string;
  offersDelivery: boolean;
  approvalStatus: ApprovalStatus;
}

export interface GeoFilter {
  lat: number;
  lng: number;
  radiusKm: number;
}

export interface PaginationConfig {
  cursor: number;
  limit: number;
}

export interface ProducerSearchFilters {
  approval?: boolean;
  categories?: string[];
  tags?: string[];
  geo?: GeoFilter;
  cursor?: number;
  limit: number;
}

export interface PaginatedProducers {
  data: Producer[];
  nextCursor?: number;
  config: PaginationConfig;
}
