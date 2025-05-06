import { Injectable } from '@nestjs/common';
import {
  HealthIndicatorService,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrismaHealthIndicator {
  constructor(
    private readonly prisma: PrismaService,
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const indicator = this.healthIndicatorService.check(key);

    try {
      const isHealthy = await this.isPrismaHealthy();
      if (isHealthy) {
        return indicator.up();
      } else {
        return indicator.down({
          message: 'Prisma is not healthy',
        });
      }
    } catch {
      return indicator.down({
        message: 'Prisma is not healthy',
      });
    }
  }
  private async isPrismaHealthy() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}
