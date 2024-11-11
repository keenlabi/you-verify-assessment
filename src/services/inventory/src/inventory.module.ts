import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './services/inventory.service';
import { DatabaseModule, InventoryRepository } from './infrastructure/databse';

@Module({
  imports: [DatabaseModule],
  controllers: [InventoryController],
  providers: [InventoryService, InventoryRepository],
})
export class AppModule {}
