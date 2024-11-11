import { ValidationError } from "src/infrastructure/errors";

export class CreateStockDto {
    name: string;
    quantityInStock: number;
    pricePerUnit: number;

    constructor(props:CreateStockDto) {
        Object.assign(this, props);
    }

    validate():ValidationError | null {
        if (!this.name) {
            throw new ValidationError("'name' cannot be empty");
        }
        if (typeof this.name !== "string") {
            throw new ValidationError("'name' must be a string");
        }
        if (!this.quantityInStock) {
            throw new ValidationError("'quantityInStock' cannot be empty");
        }
        if (typeof this.quantityInStock !== 'number') {
            throw new ValidationError("'quantityInStock' must be an integer");
        }
        if (this.quantityInStock < 0) {
            throw new ValidationError("'quantityInStock' cannot be less than 0");
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