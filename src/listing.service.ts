import { 
  Injectable, 
  NotFoundException, 
  BadRequestException, 
  InternalServerErrorException 
} from '@nestjs/common'; // Hata sınıfları buraya eklendi
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from './entities/listing.entity';

@Injectable()
export class ListingService {
  constructor(
    @InjectRepository(Listing)
    private listingRepository: Repository<Listing>,
  ) {}

 // listing.service.ts
async findAll() {
  return await this.listingRepository.find({
    // 'user' ve 'location' bilgilerini de beraberinde getirir
    relations: ['user', 'location'], 
    order: { id: 'DESC' }
  });
}

  // Controller'da silme yaparken bu metodu aradığı için ekliyoruz
  async findOne(id: number) {
    const listing = await this.listingRepository.findOne({
      where: { id },
      relations: ['user'] // Sadece sahibi kontrol etmek için
    });
    if (!listing) throw new NotFoundException('İlan bulunamadı');
    return listing;
  }
  async findByUserId(userId: number) {
  return await this.listingRepository.find({
    where: { user: { id: userId } } as any, // 'as any' tip hatalarını önler
    relations: ['location', 'user'], // İlişkileri eksiksiz ekle
  });
}

async create(data: any) {
  const userIdNum = Number(data.userId);
  const locationIdNum = Number(data.locationId);

  // Hata fırlatırken BadRequestException kullanmak daha profesyoneldir
  if (isNaN(userIdNum) || userIdNum === 0) {
    throw new BadRequestException("Geçersiz Kullanıcı ID. Lütfen giriş yapın.");
  }

  try {
    const newListing = this.listingRepository.create({
      title: data.title,
      price: Number(data.price),
      imageUrl: data.imageUrl || null,
    } as any);

    (newListing as any).user = { id: userIdNum };
    
    if (locationIdNum && !isNaN(locationIdNum)) {
      (newListing as any).location = { id: locationIdNum };
    }

    return await this.listingRepository.save(newListing);
  } catch (error) {
    // Veritabanı hatalarını konsola yazdır ki Vercel Logs'ta görebilesin
    console.error("Veritabanı Kayıt Hatası:", error);
    throw new InternalServerErrorException("İlan kaydedilirken bir hata oluştu.");
  }
}
  async update(id: number, data: any) {
    const listing = await this.listingRepository.findOne({ where: { id } }) as any;
    if (!listing) throw new NotFoundException('İlan bulunamadı');

    if (data.title) listing.title = data.title;
    if (data.price) listing.price = Number(data.price);
    if (data.imageUrl) listing.imageUrl = data.imageUrl;
    
    if (data.userId) listing.user = { id: Number(data.userId) };
    if (data.locationId) listing.location = { id: Number(data.locationId) };

    return await this.listingRepository.save(listing);
  }

  async remove(id: number) {
    return await this.listingRepository.delete(id);
  }
}