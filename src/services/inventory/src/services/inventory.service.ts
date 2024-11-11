import { Injectable } from '@nestjs/common';
import { UpdateQuery } from 'mongoose';
import { InventoryEntity } from 'src/domain/Inventory.entity';
import { IncreaseStockQuantityDto } from 'src/dtos/increaseStockQuatityDto';
import { InventoryDocument, InventoryRepository } from 'src/infrastructure/databse';
import { v4 as UUID } from "uuid";

@Injectable()
export class InventoryService {
  constructor(private readonly inventoryRepository: InventoryRepository) {}

  async createStockItem(createStockData: Partial<InventoryEntity>): Promise<InventoryEntity> {
    
    const newInventoryEntity = new InventoryEntity(
      UUID(),
      createStockData.name,
      createStockData.quantityInStock,
      createStockData.pricePerUnit
    )

    const newInventory = await this.inventoryRepository.create(newInventoryEntity);
    return new InventoryEntity(
      newInventory.id,
      newInventory.name,
      newInventory.quantityInStock,
      newInventory.pricePerUnit
    );
  }

  async retrieveStockItemByStockId(id:string): Promise<InventoryEntity> {
    const newInventory = await this.inventoryRepository.findById(id);
    return new InventoryEntity(
      newInventory.id, 
      newInventory.name,
      newInventory.quantityInStock,
      newInventory.pricePerUnit
    );
  }

  async increaseStockItemQuantity(increaseStockQuantityDto:IncreaseStockQuantityDto): Promise<InventoryEntity> {

    const update:UpdateQuery<InventoryDocument> =  { $inc: { quantityInStock: increaseStockQuantityDto.quantity } }

    const newInventory = await this.inventoryRepository.updateById(increaseStockQuantityDto.id, update);

    return new InventoryEntity(
      newInventory.id, 
      newInventory.name,
      newInventory.quantityInStock,
      newInventory.pricePerUnit
    );
  }

  // async decreaseStockItemQuantity(id:string, decrement:number): Promise<InventoryEntity> {
    // const newInventory = await this.inventoryRepository.findById(id);
    // return new InventoryEntity(
    //   newInventory.id, 
    //   newInventory.name,
    //   newInventory.quantityInStock,
    //   newInventory.pricePerUnit
    // );
  // }
}
