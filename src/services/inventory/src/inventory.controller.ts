import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { InventoryService } from './services/inventory.service';
import { InventoryEntity } from './domain/Inventory.entity';
import { CreateStockDto } from './dtos/createStockDto';
import { ServerErrorResponseDto, ServerSuccessResponseDto } from './dtos/serverResponseDto';
import { validate as isUUID } from "uuid";
import { ValidationError } from './infrastructure/errors';

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
}
