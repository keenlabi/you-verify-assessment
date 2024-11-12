import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateQuery } from 'mongoose';
import { OrderDocument } from '../schemas/order.schema';
import { OrderEntity } from 'src/domain/Order.entity';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel(OrderDocument.name) 
    private readonly orderModel: Model<OrderDocument>,
  ) {}

  async create(newOrderData: Partial<OrderEntity>): Promise<OrderDocument> {
    const createdOrder = new this.orderModel(newOrderData);
    return createdOrder.save();
  }

  async findById(id: string): Promise<OrderDocument | null> {
    return this.orderModel.findOne({ id }).exec();
  }
}
