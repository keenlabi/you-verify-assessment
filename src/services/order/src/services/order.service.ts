import { Inject, Injectable } from '@nestjs/common';
import { OrderEntity } from 'src/domain/Order.entity';
import { CreateOrderDto } from 'src/dtos/createOrderDto';
import { OrderRepository } from 'src/infrastructure/databse';
import { v4 as UUID } from "uuid";

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
  ) {}

  async createOrder(createOrderData: CreateOrderDto): Promise<OrderEntity> {
    
    const newOrderEntity = new OrderEntity(
      UUID(),
      createOrderData.stockId,
      createOrderData.quantity,
      createOrderData.pricePerUnit,
      createOrderData.quantity * createOrderData.pricePerUnit
    )

    const newOrder = await this.orderRepository.create(newOrderEntity);
    return new OrderEntity(
      newOrder.id,
      newOrder.item.stockReferenceId,
      newOrder.item.quantity,
      newOrder.item.pricePerUnit,
      newOrder.item.quantity * newOrder.item.pricePerUnit
    );
  }

  async retrieveOrderById(id:string): Promise<OrderEntity|null> {
    const newOrder = await this.orderRepository.findById(id);
    if(!newOrder) return newOrder;

    return new OrderEntity(
      newOrder.id,
      newOrder.item.stockReferenceId,
      newOrder.item.quantity,
      newOrder.item.pricePerUnit,
      newOrder.item.quantity * newOrder.item.pricePerUnit
    );
  }
}
