import { UserAssetBalanceResolver } from './user-asset-balance.resolver';
import { UserAssetBalanceService } from './user-asset-balance.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [UserAssetBalanceResolver, UserAssetBalanceService],
  exports: [UserAssetBalanceService],
})
export class UserAssetBalanceModule {}
