import {
  Body,
  Controller,
  Post,
  Logger,
  HttpStatus,
  UseGuards,
  Req,
  Res,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ResponseUtil } from '../utils/response.util';
import { AuthGuard, CurrentUser } from '@app/shared-auth';
import { Response, Request } from 'express';
import * as http from 'http';
import { URL } from 'url';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(AuthGuard)
@ApiBearerAuth('access-token')
export class NotificationsController {
  private readonly logger = new Logger(NotificationsController.name);

  constructor(private readonly notificationsService: NotificationsService) {}
  @Post('send')
  @ApiOperation({ summary: 'Send a notification' })
  @ApiResponse({
    status: 201,
    description: 'Notification queued successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: CreateNotificationDto })
  async send(@Body() dto: CreateNotificationDto) {
    this.logger.debug(`Sending notification for user: ${dto.userId}`);
    try {
      const result = await this.notificationsService.sendNotification(dto);
      return ResponseUtil.success(
        'Notification queued successfully',
        result,
        HttpStatus.CREATED,
      );
    } catch (err) {
      this.logger.error('Failed to send notification', err);
      throw err;
    }
  }  @Get('sse')
  @ApiOperation({ summary: 'Server-Sent Events proxy for real-time notifications' })
  @ApiResponse({
    status: 200,
    description: 'SSE stream established',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async sse(@Req() req: Request, @Res() res: Response, @CurrentUser('id') userId: string) {
    this.logger.debug(`Setting up SSE proxy for user: ${userId}`);
    
    // Get the notifications service URL from environment or use default
    const notificationsServiceUrl = process.env.NOTIFICATIONS_SERVICE_URL || 'http://localhost:3001';
    const targetUrl = new URL('/notifications/sse', notificationsServiceUrl);
    
    // Set up SSE headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    });

    // Create HTTP request to the notifications service
    const options = {
      hostname: targetUrl.hostname,
      port: targetUrl.port || 3001,
      path: targetUrl.pathname,
      method: 'GET',
      headers: {
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Authorization': req.headers.authorization || '',
      },
    };

    this.logger.debug(`Proxying SSE to: ${targetUrl.toString()}`);

    const proxyReq = http.request(options, (proxyRes) => {
      this.logger.debug(`SSE proxy response status: ${proxyRes.statusCode}`);
      
      if (proxyRes.statusCode !== 200) {
        res.write(`data: {"error": "Failed to connect to notifications service"}\n\n`);
        res.end();
        return;
      }

      // Pipe the response from notifications service to the client
      proxyRes.on('data', (chunk) => {
        res.write(chunk);
      });

      proxyRes.on('end', () => {
        this.logger.debug(`SSE proxy connection ended for user: ${userId}`);
        res.end();
      });

      proxyRes.on('error', (err) => {
        this.logger.error('SSE proxy error:', err);
        res.write(`data: {"error": "Connection error"}\n\n`);
        res.end();
      });
    });

    proxyReq.on('error', (err) => {
      this.logger.error('SSE proxy request error:', err);
      res.write(`data: {"error": "Failed to connect to notifications service"}\n\n`);
      res.end();
    });

    // Handle client disconnect
    req.on('close', () => {
      this.logger.debug(`Client disconnected SSE for user: ${userId}`);
      proxyReq.destroy();
    });

    req.on('aborted', () => {
      this.logger.debug(`Client aborted SSE for user: ${userId}`);
      proxyReq.destroy();
    });

    proxyReq.end();
  }
}
