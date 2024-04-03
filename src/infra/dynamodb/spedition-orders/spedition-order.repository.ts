import { DynamoDB } from 'aws-sdk';

import { SpeditionOrdersRepository } from '../../../modules/spedition-orders/spedition-orders.repository';
import { SpeditionOrder } from '../../../modules/spedition-orders/entities/spedition-order.entity';
import { DynamoDBSpeditionOrderDto } from './spedition-order.dto';

const DYNAMODB_TABLE_NAME = 'RabbitSpeditionDynamoTable';

export class DynamoDBSpeditionOrderRepository
  implements SpeditionOrdersRepository
{
  private readonly dynamoDB: DynamoDB;
  private readonly tableName = DYNAMODB_TABLE_NAME;

  constructor() {
    this.dynamoDB = new DynamoDB({
      region: 'eu-central-1',
    });
  }

  findAllSpeditionOrders = async (
    companyId: string,
  ): Promise<SpeditionOrder[]> => {
    const response = await this.dynamoDB
      .query({
        TableName: this.tableName,
        KeyConditionExpression: 'PK = :pk',
        ExpressionAttributeValues: {
          ':pk': { S: `Company#${companyId}/SpeditionOrder` },
        },
      })
      .promise();

    return response.Items.map((item) =>
      DynamoDBSpeditionOrderDto.fromItem(item).toDomain(),
    );
  };

  findSpeditionOrderById = async (
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

  createSpeditionOrder = async (
    speditionOrder: SpeditionOrder,
  ): Promise<SpeditionOrder> => {
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

  updateSpeditionOrder = async (
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

  deleteSpeditionOrder = async (
    companyId: string,
    speditionId: string,
  ): Promise<void> => {
    const params = {
      TableName: this.tableName,
      Key: {
        PK: { S: `Company#${companyId}/SpeditionOrder` },
        SK: { S: `SpeditionOrder#${speditionId}` },
      },
    };

    await this.dynamoDB.deleteItem(params).promise();
  };
}
