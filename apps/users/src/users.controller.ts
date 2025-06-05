import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@app/shared-auth/guards/auth.guard';
import { CurrentUser } from '@app/shared-auth';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '@app/shared-auth/guards/admin.guard';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { USERS_PATTERNS} from '@app/contracts';
//@ApiTags('Users')
//@UseGuards(AuthGuard)
@Controller()
//@ApiBearerAuth("access-token")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  //@Get('/me')
  /* @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: 200, description: 'Current user' })
  @ApiResponse({ status: 403, description: 'Forbidden' }) */
  @MessagePattern(USERS_PATTERNS.GET_USER)
  async getMe(@Payload() id: string): Promise<any>{
    return this.usersService.getMe(id);
  }
  /* async getMe(@CurrentUser('id') id: string){
    return this.usersService.getMe(id);
  }
 */
  /* @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'All users' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @UseGuards(AdminGuard) */
  @MessagePattern(USERS_PATTERNS.GET_ALL_USERS)
  async getUsers() {
    return this.usersService.getUsers();
  }
  
}