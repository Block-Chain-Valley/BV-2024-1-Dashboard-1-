import { User } from '../../../dashboard-server/src/user/dtos/user.model';
import { TokenTransferStatus } from '@/libs/types';
import type { WalletState } from '@web3-onboard/core';
import { BigNumber } from 'ethers';
import { Dispatch, SetStateAction } from 'react';

export type ModalContextType = [ModalContextChildren, Dispatch<SetStateAction<ModalContextChildren>>];
export type ModalContextChildren = React.ReactNode | null | React.ReactNode[] | null[];

export type WalletContextType = {
  wallet: null | WalletState;
  connecting: boolean;
  connect: (options?: ConnectOptions | undefined) => Promise<WalletState[]>;
  disconnect: (options?: ConnectOptions | undefined) => Promise<WalletState[]>;
};

export type AssetInfo = {
  address: string;
  symbol: string;
  name: string;
  decimal?: number;
};

export type UserAssetsContextType = [UserAssets, Dispatch<SetStateAction<UserAssets>>];

export type UserAssets = {
  assetInfo: AssetInfo;
  balance: string;
}[];

export type UserTransactionsContextType = [UserTransactions, Dispatch<SetStateAction<UserTransactions>>];

export type UserTransactions = {
  transactionHash: string;
  assetInfo: AssetInfo;
  targetAddress: string;
  status: TokenTransferStatus;
  transferAmount: string;
  timestamp: Date;
}[];
