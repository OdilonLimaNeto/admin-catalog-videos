import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './category/category.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule, CategoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
