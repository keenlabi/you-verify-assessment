import { Module } from '@nestjs/common';
import { DatabaseModule, OrderRepository } from './infrastructure/databse';
import { OrderController } from './api/http/order.controller';
import { OrderService } from './services/order.service';

@Module({
  imports: [DatabaseModule],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
})
export class AppModule {}
