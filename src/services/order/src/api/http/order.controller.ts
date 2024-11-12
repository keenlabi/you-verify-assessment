import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrderService } from '../../services/order.service';
import { OrderEntity } from '../../domain/Order.entity';
import { CreateOrderDto } from '../../dtos/createOrderDto';
import { ServerErrorResponseDto, ServerSuccessResponseDto } from '../../dtos/serverResponseDto';
import { validate as isUUID } from "uuid";
import { NotFoundError, ValidationError } from 'src/infrastructure/errors';

@Controller('order')
export class OrderController { 
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<ServerSuccessResponseDto<OrderEntity> | ServerErrorResponseDto> {
    
    const validationError = createOrderDto.validate();
    if(validationError) return new ServerErrorResponseDto(validationError);

    const orderEntity = await this.orderService.createOrder(createOrderDto)
    .catch((error)=> { throw new ServerErrorResponseDto(error) });

    return new ServerSuccessResponseDto(orderEntity, "New order created successfully", 201);
  }

  @Get(':id')
  async getOrderById(@Param('id') id:string): Promise<ServerSuccessResponseDto<OrderEntity> | ServerErrorResponseDto> {

    if(!id || !isUUID(id)) {
      const error = new ValidationError("invalid stock id");
      throw new ServerErrorResponseDto(error);
    }

    const inventoryEntity = await this.orderService.retrieveOrderById(id);
    if(!inventoryEntity) {
      const error = new NotFoundError("Order not found");
      throw new ServerErrorResponseDto(error);
    } 


    return new ServerSuccessResponseDto(inventoryEntity, "Stock retrieved successfully", 200);
  }
}
