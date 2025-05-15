import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotifyDto } from './dto/notify.dto';

describe('NotificationsController', () => {
  let controller: NotificationsController;
  let service: NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        {
          provide: NotificationsService,
          useValue: {
            sendNotification: jest.fn().mockResolvedValue({ status: 'Notification sent successfully' }),
          },
        },
      ],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call notificationsService.sendNotification and return result', async () => {
    const dto: NotifyDto = {
      email: 'test@example.com',
      subject: 'Hello',
      message: 'This is a test message',
    };

    const result = await controller.send(dto);
    expect(service.sendNotification).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ status: 'Notification sent successfully' });
  });
});
