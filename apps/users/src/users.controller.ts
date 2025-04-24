import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@app/shared-auth/guards/auth.guard';
import { CurrentUser } from '@app/shared-auth';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('/me')
  @UseGuards(AuthGuard)
  async getMe(@CurrentUser('id') id: string){
    return this.usersService.getMe(id);
  }
  
}