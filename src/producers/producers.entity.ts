import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export interface ProducerSchedule {
  day: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
  open: string;
  closed: string;
}

@Entity({ name: 'producers' })
export class ProducerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  highlight?: string;

  @Column({ type: 'text' })
  description: string;

  @Column('text', { array: true, default: () => "'{}'" })
  categories: string[];

  @Column('text', { array: true })
  tags: string[];

  @Column('text', { array: true, default: () => "'{}'" })
  images: string[];

  @Column({ type: 'decimal', precision: 9, scale: 6 })
  lat: number;

  @Column({ type: 'decimal', precision: 9, scale: 6 })
  lng: number;

  @Column({ type: 'varchar', length: 120 })
  suburb: string;

  @Column({ type: 'char', length: 3 })
  state: string;

  @Column('jsonb', { default: () => "'[]'" })
  schedule: ProducerSchedule[];

  @Column({ type: 'varchar', nullable: false, length: 32 })
  phone: string;

  @Column({ type: 'varchar', nullable: true, length: 255 })
  website?: string;

  @Column({ type: 'boolean', default: false })
  offersDelivery: boolean;

  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  })
  approvalStatus: 'pending' | 'approved' | 'rejected';
}
