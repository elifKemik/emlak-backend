import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  UseInterceptors, UploadedFile, ParseIntPipe, 
  Headers, ForbiddenException 
} from '@nestjs/common';
import { ListingService } from './listing.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer'; 

@Controller('ilan')
export class ListingController {
  constructor(private readonly listingService: ListingService) {}

  @Get('liste')
  async findAll() {
    return await this.listingService.findAll();
  }

  @Post('ekle')
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
  }))
  async create(
    @Body() body: any, 
    @UploadedFile() file: Express.Multer.File,
    @Headers('user-id') userIdHeader: string
  ) {
    const actualUserId = body.userId || userIdHeader;
    
    if (!actualUserId || actualUserId === "undefined") {
      throw new ForbiddenException('Giriş yapmalısınız!');
    }

    const listingData = {
      title: body.title,
      price: Number(body.price),
      locationId: body.locationId ? Number(body.locationId) : null,
      // DÜZELTME: categoryId bilgisini body'den alıp servise gönderiyoruz
      categoryId: body.categoryId ? Number(body.categoryId) : null,
      imageUrl: body.imageUrl || (file ? `https://via.placeholder.com/400x300` : null), 
      userId: Number(actualUserId)
    };

    return await this.listingService.create(listingData);
  }

  @Patch('guncelle/:id')
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
  }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File
  ) {
    const updateData = {
      ...body,
      price: body.price ? Number(body.price) : undefined,
      locationId: body.locationId ? Number(body.locationId) : undefined,
      // DÜZELTME: Güncelleme sırasında categoryId'yi sayıya çevirerek ekle
      categoryId: body.categoryId ? Number(body.categoryId) : undefined,
      imageUrl: body.imageUrl 
    };
    
    if (file) {
      updateData.imageUrl = `https://via.placeholder.com/400x300?text=Guncel+Resim`;
    }

    return await this.listingService.update(id, updateData);
  }

  @Delete('sil/:id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Headers('user-id') userIdHeader: string
  ) {
    if (!userIdHeader) throw new ForbiddenException('Giriş yapmalısınız!');
    return await this.listingService.remove(id);
  }
}