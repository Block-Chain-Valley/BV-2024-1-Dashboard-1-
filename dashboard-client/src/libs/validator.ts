import { SupportedChainIds } from './types';

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

export const validateAssetBalance = (input: string) => {
  const regex = /^\d+(\.\d+)?$/;
  return regex.test(input);
};
