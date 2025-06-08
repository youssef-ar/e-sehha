import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

describe('NotificationsController', () => {
  let controller: NotificationsController;
  let service: NotificationsService;

  beforeEach(async () => {
    const mockNotificationsService = {
      sendNotification: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        {
          provide: NotificationsService,
          useValue: mockNotificationsService,
        },
      ],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('send', () => {
    it('should send notification successfully', async () => {
      const dto = {
        userId: 'test-user-id',
        title: 'Test Notification',
        type: 'test',
        message: 'Test message',
        channels: ['email'],
        email: 'test@example.com',
      };

      const mockResponse = { status: 'queued' };
      jest.spyOn(service, 'sendNotification').mockResolvedValue(mockResponse);

      const result = await controller.send(dto as any);
      
      expect(service.sendNotification).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        success: true,
        message: 'Notification queued successfully',
        data: mockResponse,
        statusCode: 201,
      });
    });
  });
});
