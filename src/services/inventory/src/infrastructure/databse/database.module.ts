import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import InventorySchema, { InventoryDocument } from './schemas/inventory.schema';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([
      { name: InventoryDocument.name, schema: InventorySchema }, // Register Inventory model with its schema
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}