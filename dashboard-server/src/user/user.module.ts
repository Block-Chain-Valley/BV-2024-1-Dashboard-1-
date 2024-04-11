import { EtherscanModule } from '../common/etherscan/etherscan.module';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [EtherscanModule],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
