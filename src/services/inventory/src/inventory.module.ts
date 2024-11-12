import { Module } from '@nestjs/common';
import { InventoryController } from './api/http/inventory.controller';
import { InventoryService } from './services/inventory.service';
import { DatabaseModule, InventoryRepository } from './infrastructure/databse';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    DatabaseModule,
    ClientsModule.register([
      {
        name: 'INVENTORY_EVENT_CLIENT',
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
        },
      },
    ]),
  ],
  controllers: [InventoryController],
  providers: [InventoryService, InventoryRepository],
})
export class AppModule {}
