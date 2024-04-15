import { User } from './entities/user.entity';

export interface UsersRepository {
  findUserBySub(sub: string): Promise<User>;
}
