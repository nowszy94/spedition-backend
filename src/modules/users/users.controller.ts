import { Controller, Get, Logger } from '@nestjs/common';
import { UserDecorator } from '../../auth/cognito-user-email.decorator';
import { User } from './entities/user.entity';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor() {}

  @Get()
  getUser(@UserDecorator() user: User): UserDto {
    this.logger.debug(`Called getUser endpoint`);

    const { sub, firstName, lastname, email, phoneNumber } = user;

    return {
      sub,
      firstName,
      lastname,
      email,
      phoneNumber,
    };
  }
}
