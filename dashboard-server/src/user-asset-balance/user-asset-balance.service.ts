import { PrismaService } from '../common/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserAssetBalanceService {
  constructor(private readonly _prismaService: PrismaService) {}

  async resolveAsset(assetId: string) {
    if (!assetId) return null;
    return this._prismaService.asset.findUnique({
      where: {
        id: assetId,
      },
    });
  }
}
