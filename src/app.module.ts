import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { User } from './entities/user.entity';
import { Listing } from './entities/listing.entity';
import { Location } from './entities/location.entity';
import { Category } from './entities/category.entity';
import { AuthModule } from './auth/auth.module';
import { ListingModule } from './listing.module';
import { UserModule } from './user.module';
import { CategoryModule } from './category.module';

@Module({
  imports: [
    
    TypeOrmModule.forRoot({
      type: 'mysql',
      url: 'DATABASE_URL=mysql://avnadmin:AVNS_PHAepdHGamhuzo_DMZL@mysql-23a4b26c-eliffkemik-aa72.i.aivencloud.com:11788/defaultdb?ssl-mode=REQUIRED', 
      entities: [User, Listing, Location, Category],
      synchronize: true, 
      logging: true, 
      ssl: {
        rejectUnauthorized: false, 
      },
    
      extra: {
        connectionLimit: 10,
      }
    }),

   
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),

   
    AuthModule,
    ListingModule,
    UserModule,
    CategoryModule,
  ],
})
export class AppModule {}