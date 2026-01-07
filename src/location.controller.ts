import { Controller, Get, Post, Body } from '@nestjs/common';
import { LocationService } from './location.service';

@Controller('konum') // Burası 'konum' mu?
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post('ekle') // Burası 'ekle' mi?
  create(@Body() data: any) {
    return this.locationService.create(data);
  }

  @Get('liste')
  findAll() {
    return this.locationService.findAll();
  }
}