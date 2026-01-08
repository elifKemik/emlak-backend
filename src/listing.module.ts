import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListingController } from './listing.controller';
import { ListingService } from './listing.service';
import { Listing } from './entities/listing.entity';
import { Location } from './entities/location.entity';

@Module({
  imports: [
   
    TypeOrmModule.forFeature([Listing, Location])
  ],
  controllers: [ListingController],
  providers: [ListingService],
  exports: [ListingService]
})
export class ListingModule {}