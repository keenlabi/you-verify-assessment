import { OrderDocument } from "src/infrastructure/databse";

export class OrderEntity {
  readonly id:string;
  readonly item:{
    stockReferenceId:string;
    quantity:number;
    pricePerUnit:number;
  };
  readonly totalAmount:number;
  readonly createdAt?:Date
  readonly updatedAt?:Date

  // Constructor for creating an entity from user input (DTO)
  constructor(id:string, stockReferenceId:string, quantity:number, pricePerUnit:number, totalAmount:number) {
    this.id = id;
    this.item = { stockReferenceId, quantity, pricePerUnit };
    this.totalAmount = totalAmount;
  }

  static fromDocument(orderDocument: OrderDocument): OrderEntity {
    const entity = new OrderEntity(
      orderDocument.id,
      orderDocument.item.stockReferenceId,
      orderDocument.item.quantity,
      orderDocument.item.pricePerUnit,
      orderDocument.totalAmount
    );
    return entity;
  }
}