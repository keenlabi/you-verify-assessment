import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateQuery } from 'mongoose';
import { InventoryEntity } from 'src/domain/Inventory.entity';
import { UpdateStockQuantityDto } from 'src/dtos/updateStockQuatityDto';
import { InventoryDocument, InventoryRepository } from 'src/infrastructure/databse';
import { v4 as UUID } from "uuid";

@Injectable()
export class InventoryService {
  constructor(
    private readonly inventoryRepository: InventoryRepository,
    @Inject('INVENTORY_EVENT_CLIENT') private readonly eventClient: ClientProxy
  ) {}

  async createStockItem(createStockData: Partial<InventoryEntity>): Promise<InventoryEntity|null> {
    
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
    if(!newInventory) return null;

    return new InventoryEntity(
      newInventory.id, 
      newInventory.name,
      newInventory.quantityInStock,
      newInventory.pricePerUnit
    );
  }

  async updateStockItemQuantity(updateStockQuantityData:UpdateStockQuantityDto): Promise<InventoryEntity|null> {
    
    const updateStockQuantityDto = new UpdateStockQuantityDto(updateStockQuantityData.id, updateStockQuantityData.quantity);
    const update:UpdateQuery<InventoryDocument> =  { $inc: { quantityInStock: updateStockQuantityDto.quantity } }

    const newInventory = await this.inventoryRepository.updateById(updateStockQuantityDto.id, update);
    if(!newInventory) return null

    if(updateStockQuantityDto.quantity > 0) {
      const event = {
        stockId: newInventory.id,
        quantity: newInventory.quantityInStock,
        addedQuantity: updateStockQuantityDto.quantity,
        timestamp: newInventory.updatedAt,
      };
      
      this.eventClient.emit("stock.added", event);
    }

    if(updateStockQuantityDto.quantity < 0) {
      const event = {
        stockId: newInventory.id,
        quantity: newInventory.quantityInStock,
        removedQuantity: updateStockQuantityDto.quantity,
        timestamp: newInventory.updatedAt,
      };
      
      this.eventClient.emit("stock.reduced", event);
    }

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
