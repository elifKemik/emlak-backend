import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

// Entity'ler
import { User } from './entities/user.entity';
import { Listing } from './entities/listing.entity';
import { Location } from './entities/location.entity';
import { Category } from './entities/category.entity';

// Modüller
import { AuthModule } from './auth/auth.module';
import { ListingModule } from './listing.module';
import { UserModule } from './user.module';

@Module({
  imports: [
    // 1. Veritabanı Bağlantısı (Aiven & Vercel Uygun)
    TypeOrmModule.forRoot({
      type: 'mysql',
      // Vercel'e DATABASE_URL eklediysen url kısmını kullan
      // Eğer tek tek eklediysen host, port, username, password olarak ayırabilirsin
      url: process.env.DATABASE_URL, 
      entities: [User, Listing, Location, Category],
      synchronize: true, // Geliştirme aşamasında tabloları otomatik oluşturur
      logging: true, // Hata ayıklama için logları açtık (Vercel loglarında görebilirsin)
      ssl: {
        rejectUnauthorized: false, // Aiven bağlantısı için kritik ayar
      },
      // Bağlantı kopmalarını önlemek için ek ayar
      extra: {
        connectionLimit: 10,
      }
    }),

    // 2. Statik Dosya Hizmeti (Vercel'de kalıcı olmadığını unutma!)
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),

    // 3. Alt Modüller
    AuthModule,
    ListingModule,
    UserModule,
  ],
})
export class AppModule {}