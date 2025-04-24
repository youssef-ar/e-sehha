import { Injectable } from '@nestjs/common';
import { clerkClient } from '@clerk/clerk-sdk-node';
@Injectable()
export class UsersService {
  async getMe(id: string) {
    const user = clerkClient.users.getUser(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
