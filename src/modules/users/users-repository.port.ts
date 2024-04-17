import { User } from './entities/user.entity';

export interface UsersRepository {
  findAll(companyId: string): Promise<Array<User>>;
  findUserBySub(sub: string): Promise<User>;
}
