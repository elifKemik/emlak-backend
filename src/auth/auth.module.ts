import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../user.service'; 
import { User } from '../entities/user.entity';
import { Listing } from '../entities/listing.entity'; 

@Module({
  imports: [
   
    TypeOrmModule.forFeature([User, Listing]), 
    
    JwtModule.register({
      secret: 'gizli-anahtar', 
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, UserService], 
  controllers: [AuthController],
  exports: [AuthService] 
})
export class AuthModule {}