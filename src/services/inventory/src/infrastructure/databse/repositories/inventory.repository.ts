import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateOneModel, UpdateQuery } from 'mongoose';
import { InventoryDocument } from '../schemas/inventory.schema';
import { InventoryEntity } from 'src/domain/Inventory.entity';

@Injectable()
export class InventoryRepository {
  constructor(
    @InjectModel(InventoryDocument.name) 
    private readonly inventoryModel: Model<InventoryDocument>,
  ) {}

  async create(newInventoryData: Partial<InventoryEntity>): Promise<InventoryDocument> {
    const createdInventory = new this.inventoryModel(newInventoryData);
    return createdInventory.save();
  }

  async findById(id: string): Promise<InventoryDocument | null> {
    return this.inventoryModel.findOne({ id }).exec();
  }

  async updateById(id: string, update: UpdateQuery<InventoryDocument>): Promise<InventoryDocument | null> {
    return this.inventoryModel.findOneAndUpdate({id}, update, { new: true }).exec();
  }
}
