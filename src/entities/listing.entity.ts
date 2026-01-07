import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany } from 'typeorm';
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

  // İlanın sahibi olan kullanıcı/emlakçı
  @ManyToOne(() => User, (user) => user.listings)
  user: User;

  @ManyToOne(() => Category, (category) => category.listings)
  category: Category;

  @ManyToOne(() => Location, (location) => location.listings)
  location: Location;

  // Bu ilanı favorisine ekleyen kullanıcılar
  @ManyToMany(() => User, (user) => user.favorites)
  favoritedBy: User[];
}