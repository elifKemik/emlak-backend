import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Location } from './location.entity';
import { Category } from './category.entity';

@Entity()
export class Listing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  imageUrl: string;

  
  @ManyToOne(() => User, (user) => user.listings)
  user: User;

  @ManyToOne(() => Category, (category) => category.listings, { eager: true })
  @JoinColumn({ name: 'categoryId' }) // Veritabanı sütun bağlantısı eklendi
  category: Category;

  @ManyToOne(() => Location, (location) => location.listings)
  location: Location;

  
  @ManyToMany(() => User, (user) => user.favorites)
  favoritedBy: User[];
}