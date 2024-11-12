import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { InventoryService } from '../../services/inventory.service';
import { InventoryEntity } from '../../domain/Inventory.entity';
import { CreateStockDto } from '../../dtos/createStockDto';
import { ServerErrorResponseDto, ServerSuccessResponseDto } from '../../dtos/serverResponseDto';
import { validate as isUUID } from "uuid";
import { ValidationError } from '../../infrastructure/errors';
import { UpdateStockQuantityDto } from 'src/dtos/updateStockQuatityDto';
import { MessagePattern } from '@nestjs/microservices';

@Controller('inventory')
export class InventoryController { 
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  async createStockItem(@Body() createStockDto: CreateStockDto): Promise<ServerSuccessResponseDto<InventoryEntity> | ServerErrorResponseDto> {

    const validationError = createStockDto.validate();
    if(validationError) return validationError;

    const inventoryEntity = await this.inventoryService.createStockItem(createStockDto);

    return new ServerSuccessResponseDto(inventoryEntity, "New stock created successfully", 201);
  }

  @Get(':id')
  async getStockItemById(@Param('id') id:string): Promise<ServerSuccessResponseDto<InventoryEntity> | ServerErrorResponseDto> {

    if(!id || !isUUID(id)) {
      const error = new ValidationError("invalid stock id");
      throw new ServerErrorResponseDto(error);
    }

    const inventoryEntity = await this.inventoryService.retrieveStockItemByStockId(id);

    return new ServerSuccessResponseDto(inventoryEntity, "Stock retrieved successfully", 200);
  }

  @Patch()
  async updateStockQuatity(@Query() query:UpdateStockQuantityDto): Promise<ServerSuccessResponseDto<InventoryEntity> | ServerErrorResponseDto> {

    const updateStockQuantityDto = new UpdateStockQuantityDto(query);
    const validationError = updateStockQuantityDto.validate();
    if(validationError) return validationError;

    const inventoryEntity = await this.inventoryService.updateStockItemQuantity(updateStockQuantityDto);

    return new ServerSuccessResponseDto(inventoryEntity, `Stock quantity has been updated by ${query.quantity} successfully`, 200);
  }

  @MessagePattern({ cmd: 'check-stock' })
  async handleCheckStock(stockId: string): Promise<boolean> {
    const stockItem = await this.inventoryService.retrieveStockItemByStockId(stockId);
    return stockItem && stockItem.quantityInStock > 0;
  }

  @MessagePattern({ cmd: 'update-stock-quantity' })
  async handleUpdateStockQuantity(updateData:UpdateStockQuantityDto): Promise<boolean> {
    
    const updateStockQuantityDto = new UpdateStockQuantityDto(updateData);
    const validationError = updateStockQuantityDto.validate();
    if(validationError) return false;

    const stockItem = await this.inventoryService.retrieveStockItemByStockId(updateStockQuantityDto.id);
    if(!stockItem.quantityInStock) return false;
    if(Math.abs(updateStockQuantityDto.quantity) > stockItem.quantityInStock) return false;

    const inventoryEntity = await this.inventoryService.updateStockItemQuantity(updateStockQuantityDto);
    if(!inventoryEntity) return false;
    
    return true;
  }
}
