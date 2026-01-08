import { Controller, Get } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('categories') // Burası 'categories' olmalı
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get() // Bu @Get() işareti olmadan tarayıcıdan veriye ulaşılamaz
  async findAll() {
    return await this.categoryService.findAll();
  }
}