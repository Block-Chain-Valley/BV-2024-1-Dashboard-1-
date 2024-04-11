import { PrismaService } from '../common/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionService {
  constructor(private readonly _prismaService: PrismaService) {}

  async resolveAsset(address: string) {
    if (!address) return null;
    return this._prismaService.asset.findUnique({
      where: {
        address,
      },
    });
  }
}
