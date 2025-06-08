import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { ClientProxy } from '@nestjs/microservices';
import { NOTIFICATIONS_SERVICE } from '../constants';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let clientProxy: ClientProxy;

  beforeEach(async () => {
    const mockClientProxy = {
      send: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: NOTIFICATIONS_SERVICE,
          useValue: mockClientProxy,
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    clientProxy = module.get<ClientProxy>(NOTIFICATIONS_SERVICE);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendNotification', () => {
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
      jest.spyOn(clientProxy, 'send').mockReturnValue({
        pipe: () => ({
          toPromise: () => Promise.resolve(mockResponse),
        }),
      } as any);

      const result = await service.sendNotification(dto as any);
      expect(result).toEqual(mockResponse);
      expect(clientProxy.send).toHaveBeenCalledWith('notifications.send', dto);
    });
  });
});
