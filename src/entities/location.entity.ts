import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Listing } from './listing.entity'; // İlan entity'si ile ilişki kurmak için

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  city: string;

  @Column()
  district: string;

  // Bir lokasyonda birden fazla ilan olabilir (15P İlişki Puanı)
  @OneToMany(() => Listing, (listing) => listing.location)
  listings: Listing[];
}