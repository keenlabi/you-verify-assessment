import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ collection: 'inventory', timestamps: true })
export class InventoryDocument extends Document {
    @Prop({ required: true, unique: true })
    id:string;

    @Prop({ required: true, unique: true })
    name:string;
    
    @Prop({ required: true })
    quantityInStock:number;
    
    @Prop({ required: true })
    pricePerUnit:number;

    createdAt:Date;

    updatedAt:Date;
}

const InventorySchema = SchemaFactory.createForClass(InventoryDocument);
export default InventorySchema;