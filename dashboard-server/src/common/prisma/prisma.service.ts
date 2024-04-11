import { PrismaClient } from '../../../../libs/prisma/generated/client';
import { NestConfig } from '../config/config.interface';
import type { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readReplicas } from '@prisma/extension-read-replicas';

const createPrismaExtended = (prisma: PrismaService, url: string) =>
  prisma.$extends(
    readReplicas({
      url,
    })
  );

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private extendPrisma: ReturnType<typeof createPrismaExtended> | undefined;
  constructor(private readonly configService: ConfigService) {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
      errorFormat: 'colorless',
    });
  }

  get extended() {
    if (!this.extendPrisma) {
      const nestConfig = this.configService.get<NestConfig>('nest')!;
      this.extendPrisma = createPrismaExtended(this, nestConfig.readOnlyDatabaseUrl!);
    }

    return this.extendPrisma;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
