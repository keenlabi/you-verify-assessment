import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import OrderSchema, { OrderDocument } from './schemas/order.schema';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([
      { name: OrderDocument.name, schema: OrderSchema }, // Register Inventory model with its schema
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}