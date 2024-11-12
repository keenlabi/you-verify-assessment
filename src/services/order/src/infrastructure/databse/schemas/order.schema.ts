import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ collection: 'orders', timestamps: true })
export class OrderDocument extends Document {
  @Prop({ type: String, required: true })
  id: string;

  @Prop({
    type: {
      stockReferenceId: { type: String, required: true },
      quantity: { type: Number, required: true },
      pricePerUnit: { type: Number, required: true },
    },
    required: true,
  })
  item: {
    stockReferenceId: string;
    quantity: number;
    pricePerUnit: number;
  };

  @Prop({ type: Number, required: true })
  totalAmount: number;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

const OrderSchema = SchemaFactory.createForClass(OrderDocument);
export default OrderSchema;