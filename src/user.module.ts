import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller'; // Bunu eklemeyi unutmayın!
import { User } from './entities/user.entity';
import { Listing } from './entities/listing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Listing])],
  controllers: [UserController], // 404 HATASINI ÇÖZEN SATIR BURASI
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}