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
  // Task: add pagination to this function
  async getUsers(){
    const users = await clerkClient.users.getUserList();
    if (!users) {
      throw new Error('Users not found');
    }
    return users;
  }

  async getUserById(id: string) {
    const user = await clerkClient.users.getUser(id);
    if (!user) {
      throw new Error('User not found');
    }
    const { username, firstName, lastName } = user;
    return { username, firstName, lastName };
  }
}
