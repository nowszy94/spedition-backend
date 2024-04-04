import { DynamoDB } from 'aws-sdk';

import { ContractorsRepository } from '../../../modules/contractors/contractors-repository.port';
import { Contractor } from '../../../modules/contractors/entities/contractor.entity';
import { DynamoDBContractorDto } from './contractor.dto';

const DYNAMODB_TABLE_NAME = 'SpeditionInfrastructureStackDynamoTable';

export class DynamoDBContractorsRepository implements ContractorsRepository {
  private readonly dynamoDB: DynamoDB;
  private readonly tableName = process.env.databaseTable || DYNAMODB_TABLE_NAME;

  constructor() {
    this.dynamoDB = new DynamoDB({
      region: process.env.region || 'eu-central-1',
    });
  }

  async findAllContractors(companyId: string): Promise<Contractor[]> {
    const response = await this.dynamoDB
      .query({
        TableName: this.tableName,
        KeyConditionExpression: 'PK = :pk',
        ExpressionAttributeValues: {
          ':pk': { S: `Company#${companyId}/Contractor` },
        },
      })
      .promise();

    return response.Items.map((item) =>
      DynamoDBContractorDto.fromItem(item).toDomain(),
    );
  }

  async findContractor(
    companyId: string,
    contractorId: string,
  ): Promise<Contractor | null> {
    const response = await this.dynamoDB
      .getItem({
        TableName: this.tableName,
        Key: {
          PK: { S: `Company#${companyId}/Contractor` },
          SK: { S: `Contractor#${contractorId}` },
        },
      })
      .promise();

    if (!response.Item) {
      return null;
    }

    return DynamoDBContractorDto.fromItem(response.Item).toDomain();
  }

  async createContractor(contractor: Contractor): Promise<Contractor> {
    const newContractor = DynamoDBContractorDto.fromDomain(contractor);
    const newContractorItem = newContractor.toItem();

    await this.dynamoDB
      .putItem({
        TableName: this.tableName,
        Item: newContractorItem,
      })
      .promise();

    return contractor;
  }

  async deleteContractor(
    companyId: string,
    contractorId: string,
  ): Promise<void> {
    await this.dynamoDB
      .deleteItem({
        TableName: this.tableName,
        Key: {
          PK: { S: `Company#${companyId}/Contractor` },
          SK: { S: `Contractor#${contractorId}` },
        },
      })
      .promise();
  }

  async updateContractor(updatedContractor: Contractor): Promise<Contractor> {
    const contractorDto = DynamoDBContractorDto.fromDomain(updatedContractor);
    const contractorItem = contractorDto.toItem();

    await this.dynamoDB
      .putItem({
        TableName: this.tableName,
        Item: contractorItem,
      })
      .promise();

    return updatedContractor;
  }
}
