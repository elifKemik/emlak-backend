import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Listing } from './listing.entity'; 

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  city: string;

  @Column()
  district: string;

  
  @OneToMany(() => Listing, (listing) => listing.location)
  listings: Listing[];
}