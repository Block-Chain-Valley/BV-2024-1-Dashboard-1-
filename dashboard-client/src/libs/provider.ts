import { EIP1193Provider } from '@web3-onboard/core';
import { ethers } from 'ethers';

export type providerType = ethers.providers.JsonRpcProvider;

export const getProvider = (walletProvider: EIP1193Provider) => {
  return new ethers.providers.Web3Provider(walletProvider) as providerType;
};

export const getSigner = (walletProvider: EIP1193Provider) => {
  const provider = getProvider(walletProvider);
  return provider.getSigner();
};
