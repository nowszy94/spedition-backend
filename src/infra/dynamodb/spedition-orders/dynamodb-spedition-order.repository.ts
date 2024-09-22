import { DynamoDB } from 'aws-sdk';

import { SpeditionOrdersRepository } from '../../../modules/spedition-orders/ports/spedition-orders.repository';
import { SpeditionOrder } from '../../../modules/spedition-orders/entities/spedition-order.entity';
import { DynamoDBSpeditionOrderDto } from './spedition-order.dto';
import { buildOrderMonthYear } from './build-order-month-year';

const DYNAMODB_TABLE_NAME = 'SpeditionInfrastructureStackDynamoTable';

export class DynamoDBSpeditionOrderRepository
  implements SpeditionOrdersRepository
{
  private readonly dynamoDB: DynamoDB;
  private readonly tableName = process.env.databaseTable || DYNAMODB_TABLE_NAME;

  constructor() {
    this.dynamoDB = new DynamoDB({
      region: process.env.region || 'eu-central-1',
    });
  }

  findAll = async (companyId: string): Promise<SpeditionOrder[]> => {
    const response = await this.dynamoDB
      .query({
        TableName: this.tableName,
        KeyConditionExpression: 'PK = :pk',
        ExpressionAttributeValues: {
          ':pk': { S: `Company#${companyId}/SpeditionOrder` },
        },
        ScanIndexForward: false,
      })
      .promise();

    return response.Items.map((item) =>
      DynamoDBSpeditionOrderDto.fromItem(item).toDomain(),
    );
  };

  findAllWithLimit = async (
    companyId: string,
    limit: number,
  ): Promise<Array<SpeditionOrder>> => {
    const response = await this.dynamoDB
      .query({
        TableName: this.tableName,
        KeyConditionExpression: 'PK = :pk',
        ExpressionAttributeValues: {
          ':pk': { S: `Company#${companyId}/SpeditionOrder` },
        },
        ScanIndexForward: false,
        Limit: limit,
      })
      .promise();

    return response.Items.map((item) =>
      DynamoDBSpeditionOrderDto.fromItem(item).toDomain(),
    );
  };

  findById = async (
    companyId: string,
    speditionOrderId: string,
  ): Promise<SpeditionOrder | null> => {
    const response = await this.dynamoDB
      .getItem({
        TableName: this.tableName,
        Key: {
          PK: { S: `Company#${companyId}/SpeditionOrder` },
          SK: { S: `SpeditionOrder#${speditionOrderId}` },
        },
      })
      .promise();

    if (!response.Item) {
      return null;
    }

    return DynamoDBSpeditionOrderDto.fromItem(response.Item).toDomain();
  };

  create = async (speditionOrder: SpeditionOrder): Promise<SpeditionOrder> => {
    const newSpeditionOrder =
      DynamoDBSpeditionOrderDto.fromDomain(speditionOrder);

    const speditionOrderItem = newSpeditionOrder.toItem();

    await this.dynamoDB
      .putItem({
        TableName: this.tableName,
        Item: speditionOrderItem,
      })
      .promise();

    return speditionOrder;
  };

  update = async (
    speditionOrder: SpeditionOrder,
  ): Promise<SpeditionOrder | null> => {
    const speditionOrderDto =
      DynamoDBSpeditionOrderDto.fromDomain(speditionOrder);
    const speditionOrderItem = speditionOrderDto.toItem();

    await this.dynamoDB
      .putItem({
        TableName: this.tableName,
        Item: speditionOrderItem,
      })
      .promise();

    return speditionOrder;
  };

  delete = async (companyId: string, speditionId: string): Promise<void> => {
    const params = {
      TableName: this.tableName,
      Key: {
        PK: { S: `Company#${companyId}/SpeditionOrder` },
        SK: { S: `SpeditionOrder#${speditionId}` },
      },
    };

    await this.dynamoDB.deleteItem(params).promise();
  };

  findAllByMonthYear = async (
    companyId: string,
    monthYearFilters: { month: number; year: number },
  ): Promise<SpeditionOrder[]> => {
    const monthYear = buildOrderMonthYear(
      monthYearFilters.month,
      monthYearFilters.year,
    );

    const response = await this.dynamoDB
      .query({
        TableName: this.tableName,
        IndexName: 'GSI2',
        KeyConditionExpression: 'GSI2PK = :pk',
        ExpressionAttributeValues: {
          ':pk': { S: `Company#${companyId}/SpeditionOrderMonth#${monthYear}` },
        },
        ScanIndexForward: false,
      })
      .promise();

    return response.Items.map((item) =>
      DynamoDBSpeditionOrderDto.fromItem(item).toDomain(),
    );
  };

  findAllByCreatorId = async (
    companyId: string,
    creatorId: string,
  ): Promise<SpeditionOrder[]> => {
    const response = await this.dynamoDB
      .query({
        TableName: this.tableName,
        IndexName: 'GSI1',
        KeyConditionExpression: 'GSI1PK = :pk',
        ExpressionAttributeValues: {
          ':pk': {
            S: `Company#${companyId}/SpeditionOrderCreator#${creatorId}`,
          },
        },
        ScanIndexForward: false,
      })
      .promise();

    return response.Items.map((item) =>
      DynamoDBSpeditionOrderDto.fromItem(item).toDomain(),
    );
  };

  findAllByContractorId = async (
    companyId: string,
    contractorId: string,
  ): Promise<SpeditionOrder[]> => {
    const response = await this.dynamoDB
      .query({
        TableName: this.tableName,
        IndexName: 'GSI3',
        KeyConditionExpression: 'GSI3PK = :pk',
        ExpressionAttributeValues: {
          ':pk': {
            S: `Company#${companyId}/SpeditionOrderContractor#${contractorId}`,
          },
        },
        ScanIndexForward: false,
      })
      .promise();

    return response.Items.map((item) =>
      DynamoDBSpeditionOrderDto.fromItem(item).toDomain(),
    );
  };
}
