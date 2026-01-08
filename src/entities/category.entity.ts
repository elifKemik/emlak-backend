import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Listing } from './listing.entity';

@Entity('kategoriler')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

 @Column() // { name: ... } kısmını kaldırıp direkt sütun ismini verelim
  kategori_adi: string;

  
  @OneToMany(() => Listing, (listing) => listing.category)
  listings: Listing[];
}