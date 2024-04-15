import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

import { NextFunction } from 'express';
import {
  CognitoIdentityProviderClient,
  GetUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { UnauthenticatedException } from './exceptions/unauthenticated.exception';
import { UsersService } from '../modules/users/users.service';

@Injectable()
export class AuthenticationTokenCheckMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthenticationTokenCheckMiddleware.name);

  private readonly cognitoIdentityServiceProvider: CognitoIdentityProviderClient;
  private readonly userPoolId: string;
  private readonly userPoolClientId: string;

  constructor(private usersService: UsersService) {
    this.cognitoIdentityServiceProvider = new CognitoIdentityProviderClient({
      region: process.env.REGION || 'eu-central-1',
    });
    this.userPoolId = 'eu-central-1_TB4VRy2P7';
    this.userPoolClientId = '7cspdp56fv81qup7gsh5qj42ev';
  }

  async use(req, _, next: NextFunction) {
    const requestPath = req.path;

    if (!requestPath || requestPath === '/') {
      next();
      return;
    }

    const token = req.headers.authorization;

    if (!token) {
      this.logger.warn(`(path: ${requestPath}) Called without token`);
      throw new UnauthenticatedException();
    }

    const jwtToken = token.replace('Bearer ', '');

    const isTokenValid = await this.verifyToken(jwtToken);

    if (!isTokenValid) {
      this.logger.warn(
        `(path: ${requestPath}) Called with invalid token: (${token})`,
      );
      throw new UnauthenticatedException();
    }

    const cognitoUserSub = await this.getCognitoUserSub(jwtToken);

    if (!cognitoUserSub) {
      this.logger.warn(
        `(path: ${requestPath}) Called with valid token but with no email in token: ${token}`,
      );
      throw new UnauthenticatedException();
    }

    const user = await this.usersService.findBySub(cognitoUserSub);

    if (!user) {
      this.logger.warn(
        `(path: ${requestPath}) Called with valid token but user does not exists in database: sub: ${cognitoUserSub}, token: ${token}`,
      );
      throw new UnauthenticatedException();
    }

    req.user = user;

    next();
  }

  private verifyToken = async (token: string) => {
    // Verifier that expects valid access tokens:
    const verifier = CognitoJwtVerifier.create({
      userPoolId: this.userPoolId,
      tokenUse: 'access',
      clientId: this.userPoolClientId,
    });

    try {
      await verifier.verify(token);
      return true;
    } catch (e) {
      return false;
    }
  };

  private getCognitoUserSub = async (token: string) => {
    const params = {
      AccessToken: token,
    };

    const command = new GetUserCommand(params);
    const response = await this.cognitoIdentityServiceProvider.send(command);

    const sub = response.UserAttributes.find(({ Name }) => Name === 'sub');
    return sub.Value;
  };
}
