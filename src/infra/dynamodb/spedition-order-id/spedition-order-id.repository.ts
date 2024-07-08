import { SpeditionOrderIdRepository } from '../../../modules/spedition-orders/ports/spedition-order-id.repository';
import { DynamoDB } from 'aws-sdk';
import moment from 'moment';

const DYNAMODB_TABLE_NAME = 'SpeditionInfrastructureStackDynamoTable';

export class DynamoDBSpeditionOrderIdRepository
  implements SpeditionOrderIdRepository
{
  private readonly dynamoDB: DynamoDB;
  private readonly tableName = process.env.databaseTable || DYNAMODB_TABLE_NAME;

  constructor() {
    this.dynamoDB = new DynamoDB({
      region: process.env.region || 'eu-central-1',
    });
  }

  async getNextOrderIdForDate(
    companyId: string,
    forDate: Date,
  ): Promise<number> {
    const momentForDate = moment(forDate);
    const month = momentForDate.month() + 1;
    const year = momentForDate.year();

    const updated = await this.dynamoDB
      .updateItem({
        TableName: this.tableName,
        Key: {
          PK: { S: `Company#${companyId}/SpeditionOrderId` },
          SK: { S: `SpeditionOrderIdMonthYear#${month}/${year}` },
        },
        ExpressionAttributeNames: { '#C': 'lastOrderIdNumber' },
        ExpressionAttributeValues: { ':val': { N: '1' } },
        UpdateExpression: 'ADD #C :val',
        ReturnValues: 'ALL_NEW',
      })
      .promise();

    const attributes = updated.Attributes;

    return Number(attributes.lastOrderIdNumber.N);
  }
}
