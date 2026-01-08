import { 
  Injectable, 
  NotFoundException, 
  BadRequestException, 
  InternalServerErrorException 
} from '@nestjs/common'; 
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from './entities/listing.entity';

@Injectable()
export class ListingService {
  constructor(
    @InjectRepository(Listing)
    private listingRepository: Repository<Listing>,
  ) {}

  async findAll() {
    return await this.listingRepository.find({
      relations: ['user', 'location', 'category'],
      order: { id: 'DESC' }
    });
  }

  async findOne(id: number) {
    const listing = await this.listingRepository.findOne({
      where: { id },
      relations: ['user', 'location', 'category'] 
    });
    if (!listing) throw new NotFoundException('İlan bulunamadı');
    return listing;
  }

  async findByUserId(userId: number) {
    return await this.listingRepository.find({
      where: { user: { id: userId } } as any, 
      relations: ['location', 'user', 'category'], 
    });
  }

  async create(data: any) {
    const userIdNum = Number(data.userId);
    const locationIdNum = Number(data.locationId);
    const categoryIdNum = Number(data.categoryId);

    if (isNaN(userIdNum)) {
      throw new BadRequestException("Geçersiz Kullanıcı ID");
    }

    try {
      // listingRepository.create yerine doğrudan nesne oluşturup save etmek daha güvenlidir
      const newListing = this.listingRepository.create({
        title: data.title,
        price: Number(data.price),
        imageUrl: data.imageUrl || null,
      } as any);

      (newListing as any).user = { id: userIdNum };
      
      if (locationIdNum && !isNaN(locationIdNum)) {
        (newListing as any).location = { id: locationIdNum };
      }

      if (categoryIdNum && !isNaN(categoryIdNum)) {
        (newListing as any).category = { id: categoryIdNum };
      }

      const savedListing = await this.listingRepository.save(newListing);
      
      // HATA BURADAYDI: savedListing.id'nin varlığını garantiye alıyoruz
      const id = (savedListing as any).id;

      return await this.listingRepository.findOne({
        where: { id: id },
        relations: ['user', 'location', 'category']
      });
    } catch (error) {
      console.error("Veritabanı Kayıt Hatası:", error);
      throw new InternalServerErrorException("İlan kaydedilirken bir hata oluştu.");
    }
  }

  async update(id: number, data: any) {
    const listing = await this.listingRepository.findOne({ where: { id } });
    if (!listing) throw new NotFoundException('İlan bulunamadı');

    if (data.title) listing.title = data.title;
    if (data.price) listing.price = Number(data.price);
    if (data.imageUrl) listing.imageUrl = data.imageUrl;

    if (data.categoryId) {
      (listing as any).category = { id: Number(data.categoryId) };
    }
    if (data.locationId) {
      (listing as any).location = { id: Number(data.locationId) };
    }

    await this.listingRepository.save(listing);

    return await this.listingRepository.findOne({
      where: { id },
      relations: ['user', 'location', 'category']
    });
  }

  async remove(id: number) {
    return await this.listingRepository.delete(id);
  }
}