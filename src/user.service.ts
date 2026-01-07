import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Listing } from './entities/listing.entity'; // İlan entity'sini import etmeliyiz

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    
    @InjectRepository(Listing) // İlan tablosuna erişmek için buraya ekledik
    private listingRepository: Repository<Listing>,
  ) {}

  // Yeni bir kullanıcı kaydeder
 // user.service.ts dosyasına bu metodu ekle
async create(data: any) {
  const newUser = this.userRepository.create(data);
  return await this.userRepository.save(newUser);
}

  // Tüm kullanıcıları listeler
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  // Giriş (Login) işlemi için e-posta ile kullanıcıyı bulur
  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  // ID ile tek bir kullanıcıyı bulur
  async findOne(id: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  // --- FAVORİ İŞLEMLERİ ---

  // user.service.ts
async favoriEkle(userId: number, listingId: number) {
  // Kullanıcıyı mevcut favorileriyle birlikte çekiyoruz
  const user = await this.userRepository.findOne({
    where: { id: userId },
    relations: ['favorites'],
  });

  // İlanı buluyoruz
  const listing = await this.listingRepository.findOne({ where: { id: listingId } });

  if (!user || !listing) {
    throw new Error('Kullanıcı veya İlan bulunamadı');
  }

  // Eğer bu ilan zaten favorilerde yoksa listeye ekle
  const isAlreadyFavorite = user.favorites.some(fav => fav.id === listingId);
  
  if (!isAlreadyFavorite) {
    user.favorites.push(listing);
    // save işlemi user_favorites_listing ara tablosuna otomatik kayıt atar
    return await this.userRepository.save(user);
  }

  return user;
}

async favorileriGetir(userId: number) {
  const user = await this.userRepository.findOne({
    where: { id: userId },
    relations: ['favorites', 'favorites.location'], // Konum bilgisini de çekiyoruz
  });
  return user ? user.favorites : [];
}

// user.service.ts
// src/user.service.ts dosyasına git ve bu metodu ekle

async favoriCikar(userId: number, listingId: number) {
  // Kullanıcıyı mevcut favorileriyle birlikte getiriyoruz
  const user = await this.userRepository.findOne({
    where: { id: userId },
    relations: ['favorites'],
  });

  if (user) {
    // favorites listesinden o ilanı filtreliyoruz
    user.favorites = user.favorites.filter(fav => fav.id !== listingId);
    
    // Kullanıcıyı kaydettiğimizde TypeORM ara tablodaki ilişkiyi otomatik siler
    return await this.userRepository.save(user);
  }
  return null;
}
}