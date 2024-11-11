import { ValidationError } from "src/infrastructure/errors";
import { validate as isUUID } from "uuid";

export class IncreaseStockQuantityDto {
    id:string;
    quantity: number;

    constructor(props:IncreaseStockQuantityDto) {
        this.id = props?.id;
        this.quantity = Number(props?.quantity.toString())
    }

    validate():ValidationError | null {
        if(!this.id || !isUUID(this.id)) {
            throw  new ValidationError("invalid stock id");
        }
        if (!this.quantity) {
            throw new ValidationError("'quantity' cannot be empty");
        }
        if (typeof Number(this.quantity) !== 'number') {
            throw new ValidationError("'quantity' must be an integer");
        }
        if (this.quantity < 0) {
            throw new ValidationError("'quantity' cannot be less than 0");
        }

        return null
    }
}