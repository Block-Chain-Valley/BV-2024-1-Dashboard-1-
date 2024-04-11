import { UserInput } from '../common/graphql/inputs/user.input';
import { Transaction } from '../common/graphql/models/transaction.model';
import { UserAssetBalance } from '../common/graphql/models/user-asset-balance.model';
import { User } from '../common/graphql/models/user.model';
import { UserService } from './user.service';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly _userService: UserService) {}

  @Mutation(() => User)
  fetchUser(@Args('input') fetchUserInput: UserInput) {
    return this._userService.fetchUser(fetchUserInput);
  }

  @Query(() => User)
  getUser(@Args('input') getUserInput: UserInput) {
    return this._userService.getUser(getUserInput);
  }

  @ResolveField('userAssetBalances', () => [UserAssetBalance])
  async getUserAssetBalances(@Parent() user: User) {
    return this._userService.resolveUserAssetBalance(user.id);
  }

  @ResolveField('transactions', () => [Transaction])
  async getTransactions(@Parent() user: User) {
    return this._userService.resolveTransaction(user.id);
  }
}
