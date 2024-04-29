import { SupportedChainIds } from './types';
import { EIP1193Provider } from '@web3-onboard/core';

export enum ValidateState {
  NOT_VALIDATED = 'NOT_VALIDATED',
  VALIDATED = 'VALIDATED',
  DEFAULT = 'DEFAULT',
}

export const validateWalletNetwork = (walletAddress: string | undefined, rawChainId: string | undefined) => {
  if (walletAddress && rawChainId && rawChainId.toLowerCase() === SupportedChainIds.SEPOLIA_TESTNET) {
    return true;
  }
  return false;
};

export const validateAssetAddress = (input: string) => {
  const regex = /^0x([a-fA-F0-9]{40})$/;
  return regex.test(input);
};
