import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common'; 
import { UserService } from './user.service';
import { User } from './entities/user.entity';

@Controller('kullanici') // Temel adres: http://localhost:3000/kullanici
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('kayit')
  async create(@Body() userData: Partial<User>) {
    return await this.userService.create(userData);
  }

  @Get('liste')
  async findAll() {
    return await this.userService.findAll();
  }

  // Favori İlan Ekleme
  @Post('favori-ekle')
  async favoriEkle(@Body() body: { userId: number; listingId: number }) {
    console.log("Favori Ekleme İsteği:", body); // Terminalden takip için
    return await this.userService.favoriEkle(Number(body.userId), Number(body.listingId));
  }

  // Favorileri Listeleme
  @Get(':id/favoriler')
  async favorileriGetir(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.favorileriGetir(id);
  }

  // Favori Çıkarma (404 Hatasını Çözen Kısım)
  @Post('favori-cikar')
  async favoriCikar(@Body() body: { userId: number; listingId: number }) {
    console.log("Favori Çıkarma İsteği Geldi:", body); 
    return await this.userService.favoriCikar(Number(body.userId), Number(body.listingId));
  }
}