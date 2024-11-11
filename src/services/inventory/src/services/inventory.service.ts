import { Injectable } from '@nestjs/common';
import { InventoryEntity } from 'src/domain/Inventory.entity';
import { InventoryRepository } from 'src/infrastructure/databse';
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

  async retrieveStockItemById(id:string): Promise<InventoryEntity> {
    const newInventory = await this.inventoryRepository.findById(id);
    return new InventoryEntity(
      newInventory.id, 
      newInventory.name,
      newInventory.quantityInStock,
      newInventory.pricePerUnit
    );
  }

  // async increaseStockItemQuantity(id:string, increment:number): Promise<InventoryEntity> {
    
  //   const updateObj = { quantityInStock: {$inc: increment} }

  //   const newInventory = await this.inventoryRepository.updateById();

  //   return new InventoryEntity(
  //     newInventory.id, 
  //     newInventory.name,
  //     newInventory.quantityInStock,
  //     newInventory.pricePerUnit
  //   );
  // }

  // async decreaseStockItemQuantity(id:string, decrement:number): Promise<InventoryEntity> {
  //   const newInventory = await this.inventoryRepository.findById(id);
  //   return new InventoryEntity(
  //     newInventory.id, 
  //     newInventory.name,
  //     newInventory.quantityInStock,
  //     newInventory.pricePerUnit
  //   );
  // }
}
