import { ValidationError } from "src/infrastructure/errors";
import { validate as isUUID } from "uuid";

export class CreateOrderDto {
    stockId: string;
    quantity: number;
    pricePerUnit: number;

    constructor(props:CreateOrderDto) {
        Object.assign(this, props);
    }

    validate():ValidationError | null {
        if (!this.stockId || !isUUID(this.stockId)) {
            throw new ValidationError("Invalid stockReferenceId");
        }

        if (!this.quantity) {
            throw new ValidationError("'quantity' cannot be empty");
        }
        if (typeof this.quantity !== 'number') {
            throw new ValidationError("'quantity' must be an integer");
        }
        if (this.quantity < 0) {
            throw new ValidationError("'quantity' cannot be less than 0");
        }
        
        if (!this.pricePerUnit) {
            throw new ValidationError("'pricePerUnit' cannot be empty");
        }
        if (typeof this.pricePerUnit !== 'number') {
            throw new ValidationError("'pricePerUnit' must be an integer");
        }
        if (this.pricePerUnit < 0) {
            throw new ValidationError("'pricePerUnit' cannot be less than 0");
        }

        return null
    }
}