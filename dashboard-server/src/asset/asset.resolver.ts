import { CreateAssetInput, DeleteAssetInput } from '../common/graphql';
import { Asset } from '../common/graphql/models/asset.model';
import { Nft } from '../common/graphql/models/nft.model';
import { Token } from '../common/graphql/models/token.model';
import { AssetService } from './asset.service';
import { Args, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';

@Resolver(() => Asset)
export class AssetResolver {
  constructor(private readonly _assetService: AssetService) {}

  @Mutation(() => Asset, { description: '자산 생성' })
  async createAsset(@Args('input') createAssetInput: CreateAssetInput) {
    return this._assetService.createAsset(createAssetInput);
  }

  @Mutation(() => Asset, { description: '자산 삭제' })
  async deleteAsset(@Args('input') deleteAssetInput: DeleteAssetInput) {
    return this._assetService.deleteAsset(deleteAssetInput);
  }

  @ResolveField('token', () => Token, {
    nullable: true,
    description: '토큰 정보',
  })
  async resolveToken(@Parent() asset: Asset) {
    return this._assetService.resolveToken(asset.id);
  }

  @ResolveField('nft', () => Nft, { nullable: true, description: 'NFT 정보' })
  async resolveNFT(@Parent() asset: Asset) {
    return this._assetService.resolveNft(asset.id);
  }
}
