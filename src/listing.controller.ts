import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  UseInterceptors, UploadedFile, ParseIntPipe, 
  Headers, ForbiddenException 
} from '@nestjs/common';
import { ListingService } from './listing.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer'; // Değişti: diskStorage yerine memoryStorage

@Controller('ilan')
export class ListingController {
  constructor(private readonly listingService: ListingService) {}

  // 1. Tüm İlanları Getir
  @Get('liste')
  async findAll() {
    return await this.listingService.findAll();
  }

  // 3. İlan Ekle
  @Post('ekle')
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(), // Değişti: Vercel uyumlu hafıza depolaması
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

    // NOT: Vercel'de resimler diskte kalıcı olmaz. 
    // Sunumda hata almamak için geçici bir dosya adı üretiyoruz.
   const listingData = {
      title: body.title,
      price: Number(body.price),
      locationId: body.locationId ? Number(body.locationId) : null,
      // Placeholder yerine body'den gelen linki al:
      imageUrl: body.imageUrl || (file ? `https://via.placeholder.com/400x300` : null), 
      userId: Number(actualUserId)
    };

    return await this.listingService.create(listingData);
  }

  // 4. İlan Güncelle
// 4. İlan Güncelle (Patch)
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
      // Kritik Değişiklik: Eğer body içinde bir imageUrl metni gelmişse onu kullan
      imageUrl: body.imageUrl 
    };
    
    // Eğer bir dosya yüklenmişse (ki biz artık URL kullanıyoruz ama kalabilir)
    if (file) {
        updateData.imageUrl = `https://via.placeholder.com/400x300?text=Guncel+Resim`;
    }

    return await this.listingService.update(id, updateData);
  }

  // 5. İlan Sil
  @Delete('sil/:id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Headers('user-id') userIdHeader: string
  ) {
    if (!userIdHeader) throw new ForbiddenException('Giriş yapmalısınız!');
    return await this.listingService.remove(id);
  }
}