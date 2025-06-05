import {
  Controller,
  Get,
  Param,
  Logger,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { ResponseUtil } from '../utils/response.util';
import { AuthGuard, CurrentUser } from '@app/shared-auth';
import { AdminGuard } from '@app/shared-auth/guards/admin.guard';

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard)
@ApiBearerAuth('access-token')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Current user profile retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMe(@CurrentUser('id') id: string) {
    this.logger.debug(`Getting profile for user: ${id}`);
    try {
      const result = await this.usersService.getMe(id);
      return ResponseUtil.success(
        'User profile retrieved successfully',
        result,
        HttpStatus.OK,
      );
    } catch (err) {
      this.logger.error('Failed to get user profile', err);
      throw err;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'All users retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @UseGuards(AdminGuard)
  async getAllUsers() {
    this.logger.debug('Getting all users');
    try {
      const result = await this.usersService.getAllUsers();
      return ResponseUtil.success(
        'Users retrieved successfully',
        result,
        HttpStatus.OK,
      );
    } catch (err) {
      this.logger.error('Failed to get all users', err);
      throw err;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the user',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('id') id: string) {
    this.logger.debug(`Getting user by ID: ${id}`);
    try {
      const result = await this.usersService.getUserById(id);
      return ResponseUtil.success(
        'User retrieved successfully',
        result,
        HttpStatus.OK,
      );
    } catch (err) {
      this.logger.error(`Failed to get user by ID: ${id}`, err);
      throw err;
    }
  }
}
