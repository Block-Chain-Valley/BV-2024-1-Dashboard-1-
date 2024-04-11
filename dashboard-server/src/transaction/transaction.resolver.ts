import { Asset } from '../common/graphql/models/asset.model';
import { Transaction } from '../common/graphql/models/transaction.model';
import { TransactionService } from './transaction.service';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

@Resolver(() => Transaction)
export class TransactionResolver {
  constructor(private readonly _transactionService: TransactionService) {}

  @ResolveField('asset', () => Asset, { description: '자산 정보' })
  async resolveNFT(@Parent() transaction: Transaction) {
    return this._transactionService.resolveAsset(transaction.address);
  }
}
