import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Listing } from './listing.entity';

@Entity('kategoriler')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'kategori_adi', unique: true })
  name: string; // Örn: Satılık, Kiralık

  // Bire-Çok İlişki: Bir kategori altında birçok ilan listelenebilir.
  @OneToMany(() => Listing, (listing) => listing.category)
  listings: Listing[];
}