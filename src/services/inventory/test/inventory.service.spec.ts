import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from 'src/services/inventory.service';
import { InventoryDocument, InventoryRepository } from 'src/infrastructure/databse'; // Adjusted import path if needed
import { UpdateStockQuantityDto } from 'src/dtos/updateStockQuatityDto';
import { InventoryEntity } from 'src/domain/Inventory.entity';
import { v4 as UUID } from 'uuid';
import { UpdateQuery } from 'mongoose';

// Mock repository and event client
const inventoryRepositoryMock = {
  create: jest.fn<Promise<InventoryDocument>, [Partial<InventoryEntity>]>(),
  findById: jest.fn<Promise<InventoryDocument>, [string]>(),
  updateById: jest.fn<Promise<InventoryDocument>, [string, UpdateQuery<InventoryDocument>]>()
};

const eventClientMock = {
  emit: jest.fn(),
};

describe('InventoryService', () => {
  let service: InventoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: InventoryRepository,
          useValue: inventoryRepositoryMock,
        },
        {
          provide: 'INVENTORY_EVENT_CLIENT',
          useValue: eventClientMock,
        },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should create a new stock item and return an InventoryEntity', async () => {
    const createStockData = {
      name: 'Item1',
      quantityInStock: 100,
      pricePerUnit: 20,
    };

    const createdStock: InventoryDocument = {
      id: UUID(),
      name: 'Item1',
      quantityInStock: 100,
      pricePerUnit: 20,
      createdAt: new Date(),
      updatedAt: new Date(),
      _id: UUID(),  // Mongoose-generated ID
    } as InventoryDocument;

    inventoryRepositoryMock.create.mockResolvedValue(createdStock);

    const result = await service.createStockItem(createStockData);

    expect(result).toEqual(new InventoryEntity(
      createdStock.id,
      createdStock.name,
      createdStock.quantityInStock,
      createdStock.pricePerUnit
    ));
    expect(inventoryRepositoryMock.create).toHaveBeenCalledWith(expect.any(InventoryEntity));
  });

  it('should retrieve a stock item by id', async () => {
    const stockId = UUID();
    const stockItem: InventoryDocument = {
      id: stockId,
      name: 'Item1',
      quantityInStock: 100,
      pricePerUnit: 20,
      createdAt: new Date(),
      updatedAt: new Date(),
      _id: UUID(),
    } as InventoryDocument;

    inventoryRepositoryMock.findById.mockResolvedValue(stockItem);

    const result = await service.retrieveStockItemByStockId(stockId);

    expect(result).toEqual(new InventoryEntity(
      stockItem.id,
      stockItem.name,
      stockItem.quantityInStock,
      stockItem.pricePerUnit
    ));
    expect(inventoryRepositoryMock.findById).toHaveBeenCalledWith(stockId);
  });

  it('should update the stock quantity and emit an event for added stock', async () => {
    const updateStockQuantityDto = new UpdateStockQuantityDto(UUID(), 50);

    const updatedStock: InventoryDocument = {
      id: updateStockQuantityDto.id,
      name: 'Item1',
      quantityInStock: 150,
      pricePerUnit: 20,
      createdAt: new Date(),
      updatedAt: new Date(),
      _id: UUID(),
    } as InventoryDocument;

    inventoryRepositoryMock.updateById.mockResolvedValue(updatedStock);

    const result = await service.updateStockItemQuantity(updateStockQuantityDto);

    expect(result).toEqual(new InventoryEntity(
      updatedStock.id,
      updatedStock.name,
      updatedStock.quantityInStock,
      updatedStock.pricePerUnit
    ));

    expect(inventoryRepositoryMock.updateById).toHaveBeenCalledWith(
      updateStockQuantityDto.id,
      { $inc: { quantityInStock: updateStockQuantityDto.quantity } }
    );
    expect(eventClientMock.emit).toHaveBeenCalledWith('stock.added', {
      stockId: updatedStock.id,
      quantity: updatedStock.quantityInStock,
      addedQuantity: updateStockQuantityDto.quantity,
      timestamp: updatedStock.updatedAt,
    });
  });

  it('should update the stock quantity and emit an event for reduced stock', async () => {
    const updateStockQuantityDto = new UpdateStockQuantityDto(UUID(), -30);

    const updatedStock: InventoryDocument = {
      id: updateStockQuantityDto.id,
      name: 'Item1',
      quantityInStock: 70,
      pricePerUnit: 20,
      createdAt: new Date(),
      updatedAt: new Date(),
      _id: UUID(),
    } as InventoryDocument;

    inventoryRepositoryMock.updateById.mockResolvedValue(updatedStock);

    const result = await service.updateStockItemQuantity(updateStockQuantityDto);

    expect(result).toEqual(new InventoryEntity(
      updatedStock.id,
      updatedStock.name,
      updatedStock.quantityInStock,
      updatedStock.pricePerUnit
    ));

    expect(inventoryRepositoryMock.updateById).toHaveBeenCalledWith(
      updateStockQuantityDto.id,
      { $inc: { quantityInStock: updateStockQuantityDto.quantity } }
    );
    expect(eventClientMock.emit).toHaveBeenCalledWith('stock.reduced', {
      stockId: updatedStock.id,
      quantity: updatedStock.quantityInStock,
      removedQuantity: Math.abs(updateStockQuantityDto.quantity),
      timestamp: updatedStock.updatedAt,
    });
  });
});
