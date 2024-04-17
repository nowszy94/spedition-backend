import { Controller, Get, Logger } from '@nestjs/common';
import { UserDecorator } from '../../auth/cognito-user-email.decorator';
import { User } from './entities/user.entity';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(readonly usersService: UsersService) {}

  @Get()
  async getUser(@UserDecorator() user: User): Promise<Array<UserDto>> {
    this.logger.debug(`Called findAllUsers endpoint`);

    return (await this.usersService.findAll(user.companyId)).map((user) => ({
      sub: user.sub,
      firstName: user.firstName,
      lastname: user.lastname,
      email: user.email,
      phoneNumber: user.phoneNumber,
    }));
  }
}
