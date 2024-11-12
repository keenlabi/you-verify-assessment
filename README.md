# Design Documentation for E-Commerce Inventory & Order Microservices

## Project Overview

This project involves building a microservice architecture to handle inventory management and order processing using NestJS, MongoDB, and a message broker for service communication.

## Architectural Overview

### 1. Service Separation

The architecture is split into two main services: **Inventory Service** and **Order Service**. Each service manages its own domain logic and database, ensuring loose coupling and independent scalability.

### 2. Database Design

Each service operates with its own database instance, maintaining data autonomy and aligning with the Domain-Driven Design (DDD) principles.

### 3. Communication Between Services

Communication between the **Inventory Service** and **Order Service** is handled via a message broker (Redis), enabling asynchronous message passing.

## Key Design Choices

### 1. Domain-Driven Design (DDD)

In this implementation, I adopted a **Domain-Driven Design (DDD) approach** to ensure the codebase is scalable, maintainable, and well-structured. Here's an overview of the design choices:

1. **Entities and Aggregates**

	Both services define entities that represent business objects
	
	- `InventoryEntity` 
		- Represents an item in stock.
		- Has attributes such as `id`, `name`, `quantityInStock`, and `pricePerUnit`.
		- The `fromDocument` method allows creating an entity instance from an `InventoryDocument`, ensuring that the domain logic can easily map persisted data to domain models.
		- The immutability of properties (using `readonly`) ensures that once an `InventoryEntity` instance is created, its properties cannot be modified directly, preserving the integrity of the object.
	  
	- `OrderEntity`.
		- Represents an order placed for items in stock.
	    - Contains nested information such as `stockReferenceId`, `quantity`, and `pricePerUnit`, encapsulated within an `item` object.
	    - Has properties for `totalAmount`, `createdAt`, and `updatedAt`, which are essential for tracking the lifecycle of an order.
	    - The `fromDocument` method converts an `OrderDocument` from the persistence layer into an `OrderEntity`, maintaining consistency between the database model and the domain entity.

2. **Separation of Concerns:**

	- **Repositories**: The repository layer abstracts database interactions, encapsulating data access logic. This keeps the domain logic clean and independent of specific database technologies. By isolating the data layer, the service can evolve without impacting the core logic, facilitating easier updates or changes to the underlying data source (e.g., switching databases).
  
	- **Services**: The service layer acts as an intermediary between the domain logic and external interfaces (controllers). It contains the business logic and ensures the application’s use cases are executed correctly. Services also coordinate interactions between multiple repositories when needed, adhering to the **Single Responsibility Principle**.
  
	- **Controllers**: The controllers handle HTTP requests and responses, acting as the entry points to the service layer. This keeps them focused on routing and handling client communication without embedding business logic.
	
3. **Use of Decorators:**

	Decorators in **NestJS** are used extensively to provide metadata and enhance code functionality. Key decorators include:

	- `@Controller()`: this is used to define a class as a controller that handles incoming requests and routes them to the appropriate service methods.
	
	- `@Injectable()`: this is used to mark a class as a provider that can be injected as a dependency, fostering modular and testable code.
	  
	- `@Post()`, `@Get()`, etc.: this is used to define the HTTP method for a specific route within a controller, simplifying endpoint creation.
	  
	- `@Body()`, `@Param()`, etc.: this is used to bind request data to method parameters, ensuring that incoming data is easily accessible.

### 2. Folder Structure

- **HTTP Controllers**: Handle client HTTP requests (e.g., `order.http.controller.ts`).
- **Message Broker Controllers**: Handle communication between microservices (e.g., `order.events.controller.ts`).
- **Infrastructure**: Contains database modules, schemas, and related infrastructure code.
- **Domain**: Holds core business logic entities.

### 3. Event-Driven Communication

To ensure robust event propagation:

- **Stock Update Events**
	- The **Inventory Service** publishes events whenever stock is updated. 
	- The **Order Service** listens to these events and logs changes for audit purposes.
	
- **Communication Protocol**: Redis is used as the transport mechanism due to its simplicity and support for event streaming.

### 4. Validation Strategy

- **DTOs (Data Transfer Objects)**: Used for input validation at the controller level.

### 5. Error Handling

Custom error handling is implemented using an exception filter. This filter formats validation errors and ensures consistent error responses.

## Service Logic

### Inventory Service

- **Endpoints**: CRUD operations for inventory management.

1. Create Stock Item: 
	`POST`: /inventory
	
	Request Body
	``` JSON
	{
	  "name":"face caps",
	  "quantityInStock": 20,
	  "pricePerUnit": 1500
	}
	```

	 Response
	 Success
	 Error
	 

2. Retrieve Stock Item: 
	`GET`: /inventory/:id
	
3. Update Stock Quantity: 
	`PATCH`: /inventory?id=""&quantity="-10"
	
- **Event Publishing**: Triggers stock update events when changes occur.
	There are two events that are published:
	1. Stock Added: This is triggered if the quantity added is greater than 0
		`stock.added`
		
	1. Stock Reduced: This is triggered if the quantity added is greater than 0
		`stock.reduced`
	   
- **Validation**: Ensures valid stock data using DTOs and entity logic.

### Order Service

- **Endpoints**: Handles order creation, and management.
1. Create Order: 
	`POST`: /order
	
	Request Body
	``` JSON
	{
	  "stockId":"b9891e0d-36e4-4fb1-a054-52d375565128",
	  "quantity": 100,
	  "pricePerUnit": 15
	}
	```

	 Response
	 Success
	 Error
	 

2. Retrieve Stock Item: 
	`GET`: /order/:id
	
3. Update Stock Quantity: 
	`PATCH`: /inventory?id=""&quantity="-10"
	
- **Stock Validation**: Checks stock availability by communicating with the **Inventory Service**.
- **Logging**: Listens for stock update events and logs them in a designated log table for audit purposes.

