import { Controller} from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { USERS_PATTERNS} from '@app/contracts';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @MessagePattern(USERS_PATTERNS.GET_USER)
  async getMe(@Payload() id: string): Promise<any>{
    return this.usersService.getMe(id);
  }
  @MessagePattern(USERS_PATTERNS.GET_ALL_USERS)
  async getUsers() {
    return this.usersService.getUsers();
  }
  @MessagePattern(USERS_PATTERNS.GET_USER_BY_ID)
  async getUserById(@Payload() id: string) {
    return this.usersService.getUserById(id);
  }
  
}