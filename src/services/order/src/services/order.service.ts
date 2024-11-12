import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy} from '@nestjs/microservices';
import { OrderEntity } from 'src/domain/Order.entity';
import { CreateOrderDto } from 'src/dtos/createOrderDto';
import { OrderRepository } from 'src/infrastructure/databse';
import { v4 as UUID } from "uuid";
import { firstValueFrom } from 'rxjs'
import { CustomError } from 'src/infrastructure/errors/CustomError';
import { BadRequestError } from 'src/infrastructure/errors';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    @Inject('INVENTORY_SERVICE') private readonly inventoryClient: ClientProxy,
  ) {}

  async createOrder(createOrderData: CreateOrderDto): Promise<OrderEntity> {
    return new Promise(async (resolve, reject)=> {
      // const isStockQuantityEnough = await this.checkStock(createOrderData.stockId);
      const isStockQuantityEnough = await this.updateStock(createOrderData.stockId, -createOrderData.quantity);
      if(!isStockQuantityEnough) {
        const error = new BadRequestError("Stock level is too low for this order");
        return reject(error)
      } 
  
      const newOrderEntity = new OrderEntity(
        UUID(),
        createOrderData.stockId,
        createOrderData.quantity,
        createOrderData.pricePerUnit,
        createOrderData.quantity * createOrderData.pricePerUnit
      )
  
      const newOrder = await this.orderRepository.create(newOrderEntity);
      return resolve(new OrderEntity(
        newOrder.id,
        newOrder.item.stockReferenceId,
        newOrder.item.quantity,
        newOrder.item.pricePerUnit,
        newOrder.item.quantity * newOrder.item.pricePerUnit
      ));
    })
  }

  async checkStock(stockId: string): Promise<boolean> {
    const stockStatus = await firstValueFrom(
      this.inventoryClient.send<boolean, string>(
        { cmd: 'check-stock' },
        stockId,
      )
    );
    
    return stockStatus;
  }

  async updateStock(stockId: string, quantity: number): Promise<boolean> {
    const updateStockStatus = await firstValueFrom(
      this.inventoryClient.send<boolean, { id:string, quantity:number }>(
        { cmd: 'update-stock-quantity' },
        {
          id: stockId,
          quantity
        },
      )
    );
    
    return updateStockStatus;
  }

  async retrieveOrderById(id:string): Promise<OrderEntity|null> {
    const newOrder = await this.orderRepository.findById(id);
    if(!newOrder) return null;

    return new OrderEntity(
      newOrder.id,
      newOrder.item.stockReferenceId,
      newOrder.item.quantity,
      newOrder.item.pricePerUnit,
      newOrder.item.quantity * newOrder.item.pricePerUnit
    );
  }
}
