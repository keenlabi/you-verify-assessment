import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";

@Controller()
export class OrderEventsController {
  @EventPattern('stock.added')
  async handleStockQuantityAddeddEvent(data: any) {
    console.log('Stock updated:', data);
  }

  @EventPattern('stock.reduced')
  async handleStockQuantityReduceddEvent(data: any) {
    console.log('Stock updated:', data);
  }
}