import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';

@Injectable()
export class LocationService {
  constructor(@InjectRepository(Location) private repo: Repository<Location>) {}

  async create(data: Partial<Location>) {
    return await this.repo.save(this.repo.create(data));
  }

  async findAll() {
    return await this.repo.find();
  }
}