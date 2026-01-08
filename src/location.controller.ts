import { Controller, Get, Post, Body } from '@nestjs/common';
import { LocationService } from './location.service';

@Controller('konum') 
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post('ekle')
  create(@Body() data: any) {
    return this.locationService.create(data);
  }

  @Get('liste')
  findAll() {
    return this.locationService.findAll();
  }
}