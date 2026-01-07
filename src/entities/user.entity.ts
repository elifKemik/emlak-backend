import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Listing } from './listing.entity';

@Entity('kullanicilar') // Veritabanında tablo adı 'kullanicilar' olacak
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'eposta', unique: true }) // Sütun adı 'eposta' olacak
  email: string;

  @Column({ name: 'sifre' })
  password: string;

  @Column({ name: 'rol' })
  role: string; 

// user.entity.ts içinde olması gereken ilgili kısım:
@OneToMany(() => Listing, (listing) => listing.user)
listings: Listing[];

@ManyToMany(() => Listing, (listing) => listing.favoritedBy)
@JoinTable()
favorites: Listing[];

}