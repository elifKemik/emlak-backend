import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

// Servis ve Entity Importları
import { UserService } from '../user.service'; 
import { User } from '../entities/user.entity';
import { Listing } from '../entities/listing.entity'; // Favori sistemi için gerekli

@Module({
  imports: [
    // UserService içinde ListingRepository kullandığımız için 
    // buraya Listing'i de eklemek ZORUNDAYIZ.
    TypeOrmModule.forFeature([User, Listing]), 
    
    JwtModule.register({
      secret: 'gizli-anahtar', // Ödev için basit bir anahtar
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, UserService], 
  controllers: [AuthController],
  exports: [AuthService] // Gerekirse dışarıya açıyoruz
})
export class AuthModule {}