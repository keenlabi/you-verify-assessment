import { Module } from '@nestjs/common';
import { DatabaseModule, OrderRepository } from './infrastructure/databse';
import { OrderController } from './api/http/order.controller';
import { OrderService } from './services/order.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    DatabaseModule,
    ClientsModule.register([
      {
        name: 'INVENTORY_SERVICE',
        transport: Transport.REDIS, // or Transport.TCP, depending on your configuration
        options: {
          host: 'localhost',
          port: 6379, // Port of the Redis server or other transport option
        },
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
})
export class AppModule {}
