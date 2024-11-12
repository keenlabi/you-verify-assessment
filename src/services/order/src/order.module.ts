import { Module } from '@nestjs/common';
import { DatabaseModule, OrderRepository } from './infrastructure/databse';
import {  OrderHTTPController } from './api/http/order.http.controller';
import { OrderService } from './services/order.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrderEventsController } from './api/events/order.events.controller';

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
  controllers: [OrderHTTPController, OrderEventsController],
  providers: [OrderService, OrderRepository],
})
export class AppModule {}
