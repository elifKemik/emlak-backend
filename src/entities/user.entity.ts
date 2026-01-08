import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Listing } from './listing.entity';

@Entity('kullanicilar') 
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'eposta', unique: true }) 
  email: string;

  @Column({ name: 'sifre' })
  password: string;

  @Column({ name: 'rol' })
  role: string; 


@OneToMany(() => Listing, (listing) => listing.user)
listings: Listing[];

@ManyToMany(() => Listing, (listing) => listing.favoritedBy)
@JoinTable()
favorites: Listing[];

}