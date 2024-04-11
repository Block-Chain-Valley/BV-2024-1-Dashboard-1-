import { EtherscanService } from './etherscan.service';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

@Module({
  imports: [HttpModule],
  providers: [EtherscanService],
  exports: [EtherscanService],
})
export class EtherscanModule {}
