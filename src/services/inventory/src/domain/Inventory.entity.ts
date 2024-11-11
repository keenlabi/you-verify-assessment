import { InventoryDocument } from "src/infrastructure/databse";

export class InventoryEntity {
  readonly id:string
  readonly name:string
  readonly quantityInStock:number
  readonly pricePerUnit:number

  // Constructor for creating an entity from user input (DTO)
  constructor(id:string, name:string, quantityInStock:number, pricePerUnit:number) {
    this.id = id;
    this.name = name;
    this.quantityInStock = quantityInStock;
    this.pricePerUnit = pricePerUnit;
  }

  static fromDocument(inventoryDocument: InventoryDocument): InventoryEntity {
    const entity = new InventoryEntity(
      inventoryDocument.id,
      inventoryDocument.name,
      inventoryDocument.quantityInStock,
      inventoryDocument.pricePerUnit,
    );
    return entity;
  }
}