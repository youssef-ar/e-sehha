import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { handleRpcError } from '../utils/error-handler.util';
import { USERS_SERVICE } from '../constants';
import { USERS_PATTERNS } from '@app/contracts/users/users.patterns';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @Inject(USERS_SERVICE) private usersClient: ClientProxy,
  ) {}

  async getMe(id: string) {
    this.logger.debug(`Getting user profile for ID: ${id}`);
    try {
      const result = await lastValueFrom(
        this.usersClient.send(USERS_PATTERNS.GET_USER, id),
      );
      this.logger.debug(`Retrieved user profile for ID: ${id}`);
      return result;
    } catch (err) {
      handleRpcError(err, this.logger, 'get user profile');
    }
  }

  async getAllUsers() {
    this.logger.debug('Getting all users');
    try {
      const result = await lastValueFrom(
        this.usersClient.send(USERS_PATTERNS.GET_ALL_USERS, {}),
      );
      this.logger.debug('Retrieved all users');
      return result;
    } catch (err) {
      handleRpcError(err, this.logger, 'get all users');
    }
  }

  async getUserById(id: string) {
    this.logger.debug(`Getting user by ID: ${id}`);
    try {
      const result = await lastValueFrom(
        this.usersClient.send(USERS_PATTERNS.GET_USER_BY_ID, id),
      );
      this.logger.debug(`Retrieved user by ID: ${id}`);
      return result;
    } catch (err) {
      handleRpcError(err, this.logger, 'get user by id');
    }
  }
}
