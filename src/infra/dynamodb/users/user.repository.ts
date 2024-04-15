import { UsersRepository } from '../../../modules/users/users-repository.port';
import { DynamoDB } from 'aws-sdk';
import { User } from '../../../modules/users/entities/user.entity';
import { DynamoDBUserDto } from './user.dto';
import { Logger } from '@nestjs/common';

const DYNAMODB_TABLE_NAME = 'SpeditionInfrastructureStackDynamoTable';

export class DynamoDBUsersRepository implements UsersRepository {
  private readonly logger = new Logger(DynamoDBUsersRepository.name);

  private readonly dynamoDB: DynamoDB;
  private readonly tableName = process.env.databaseTable || DYNAMODB_TABLE_NAME;

  constructor() {
    this.dynamoDB = new DynamoDB({
      region: process.env.region || 'eu-central-1',
    });
  }

  async findUserBySub(sub: string): Promise<User> {
    const response = await this.dynamoDB
      .query({
        TableName: this.tableName,
        IndexName: 'GSI1',
        KeyConditionExpression: 'GSI1PK = :gsi1pk',
        ExpressionAttributeValues: {
          ':gsi1pk': { S: `User#${sub}` },
        },
      })
      .promise();

    if (!response.Items || response.Items.length === 0) {
      this.logger.warn(`No user found for sub ${sub}`);
      return null;
    }

    if (response.Items.length > 1) {
      this.logger.error(`Found multiple users for sub ${sub}`);
      return null;
    }

    return DynamoDBUserDto.fromItem(response.Items[0]).toDomain();
  }
}
