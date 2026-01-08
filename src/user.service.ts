import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Listing } from './entities/listing.entity'; 

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    
    @InjectRepository(Listing) 
    private listingRepository: Repository<Listing>,
  ) {}

  
async create(data: any) {
  const newUser = this.userRepository.create(data);
  return await this.userRepository.save(newUser);
}

  
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

 
  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findOne(id: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  
async favoriEkle(userId: number, listingId: number) {
 
  const user = await this.userRepository.findOne({
    where: { id: userId },
    relations: ['favorites'],
  });

  const listing = await this.listingRepository.findOne({ where: { id: listingId } });

  if (!user || !listing) {
    throw new Error('Kullanıcı veya İlan bulunamadı');
  }

  const isAlreadyFavorite = user.favorites.some(fav => fav.id === listingId);
  
  if (!isAlreadyFavorite) {
    user.favorites.push(listing);
    return await this.userRepository.save(user);
  }

  return user;
}

async favorileriGetir(userId: number) {
  const user = await this.userRepository.findOne({
    where: { id: userId },
    relations: ['favorites', 'favorites.location'], 
  });
  return user ? user.favorites : [];
}



async favoriCikar(userId: number, listingId: number) {
  const user = await this.userRepository.findOne({
    where: { id: userId },
    relations: ['favorites'],
  });

  if (user) {
    
    user.favorites = user.favorites.filter(fav => fav.id !== listingId);
    
    return await this.userRepository.save(user);
  }
  return null;
}
}