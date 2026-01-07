import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListingController } from './listing.controller';
import { ListingService } from './listing.service';
import { Listing } from './entities/listing.entity';
import { Location } from './entities/location.entity';

@Module({
  imports: [
    // Bu modülün hangi tabloları kullanacağını söylüyoruz
    TypeOrmModule.forFeature([Listing, Location])
  ],
  controllers: [ListingController],
  providers: [ListingService],
  exports: [ListingService] // Gerekirse başka yerlerde kullanmak için dışa açıyoruz
})
export class ListingModule {}