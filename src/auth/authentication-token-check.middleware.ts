import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

import { NextFunction } from 'express';
import {
  CognitoIdentityProviderClient,
  GetUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { knownUsers } from './known-users.mock';
import { UnauthenticatedException } from './exceptions/unauthenticated.exception';

@Injectable()
export class AuthenticationTokenCheckMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthenticationTokenCheckMiddleware.name);

  private readonly cognitoIdentityServiceProvider: CognitoIdentityProviderClient;
  private readonly userPoolId: string;
  private readonly userPoolClientId: string;

  constructor() {
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

    const cognitoUserEmail = await this.getCognitoUser(jwtToken);

    if (!cognitoUserEmail) {
      this.logger.warn(
        `(path: ${requestPath}) Called with valid token but with no email in token: ${token}`,
      );
      throw new UnauthenticatedException();
    }

    const user = knownUsers.find(
      (knownUsers) => knownUsers.email === cognitoUserEmail,
    );

    if (!user) {
      this.logger.warn(
        `(path: ${requestPath}) Called with valid token but without associated user: email: ${cognitoUserEmail}, token: ${token}`,
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

  private getCognitoUser = async (token: string) => {
    const params = {
      AccessToken: token,
    };

    const command = new GetUserCommand(params);
    const response = await this.cognitoIdentityServiceProvider.send(command);

    const email = response.UserAttributes.find(({ Name }) => Name === 'email');
    return email.Value;
  };
}
