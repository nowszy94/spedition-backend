import { Controller, Get, Logger } from '@nestjs/common';
import { UserDecorator } from '../../auth/cognito-user-email.decorator';
import { User } from './entities/user.entity';
import { UserDto } from './dto/user.dto';

@Controller('user-details')
export class UserDetailsController {
  private readonly logger = new Logger(UserDetailsController.name);

  constructor() {}

  @Get()
  getUser(@UserDecorator() user: User): UserDto {
    this.logger.debug(`Called findUserDetails endpoint`);

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
