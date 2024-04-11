import { AssetResolver } from './asset.resolver';
import { AssetService } from './asset.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [AssetResolver, AssetService],
  exports: [AssetService],
})
export class AssetModule {}
