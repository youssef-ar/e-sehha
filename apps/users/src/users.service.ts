import { Injectable } from '@nestjs/common';
import { clerkClient } from '@clerk/clerk-sdk-node';
import e from 'express';
@Injectable()
export class UsersService {
  async getMe(id: string) {
    const user = await clerkClient.users.getUser(id);
    if (!user) {
      throw new Error('User not found');
    }
    return {
    id: user.id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.emailAddresses[0]?.emailAddress,
    imageUrl: user.imageUrl,
    role: user.publicMetadata?.role,
    createdAt: user.createdAt,
    lastSignInAt: user.lastSignInAt,
    banned: user.banned,
    locked: user.locked
  };
  }
  // Task: add pagination to this function
  async getUsers(){
    const { data: users } = await clerkClient.users.getUserList();
    if (!users || users.length === 0) {
      throw new Error('Users not found');
    }
    return users.map(user => ({
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.emailAddresses[0]?.emailAddress,
      imageUrl: user.imageUrl,
      role: user.publicMetadata?.role,
      createdAt: user.createdAt,
      lastSignInAt: user.lastSignInAt,
      banned: user.banned,
      locked: user.locked
    }));
  }

  async getUserById(id: string) {
    const user = await clerkClient.users.getUser(id);
    if (!user) {
      throw new Error('User not found');
    }
    const { username, firstName, lastName } = user;
    const email = user.emailAddresses[0]?.emailAddress
    return { username, firstName, lastName, email };
  }

  async validateDoctor(email: string) {
  const users = await clerkClient.users.getUserList({
    emailAddress: [email],
  });

  if (!users) {
    throw new Error('Doctor not found');
  }
  const user = users[0];

  await clerkClient.users.updateUser(user.id, {
    publicMetadata: {
      ...user.publicMetadata,
      role: 'DOCTOR',
    },
  });
}
  
}
