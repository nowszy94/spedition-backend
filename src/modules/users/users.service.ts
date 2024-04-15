import { Injectable } from '@nestjs/common';

import { UsersRepository } from './users-repository.port';
import { DynamoDBUsersRepository } from '../../infra/dynamodb/users/user.repository';

@Injectable()
export class UsersService {
  private readonly usersRepository: UsersRepository;

  constructor() {
    this.usersRepository = new DynamoDBUsersRepository();
  }

  async findBySub(sub: string) {
    return await this.usersRepository.findUserBySub(sub);
  }
}
