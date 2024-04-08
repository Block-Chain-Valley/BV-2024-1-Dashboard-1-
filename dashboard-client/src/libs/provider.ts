import { EIP1193Provider } from '@web3-onboard/core';
import { ethers } from 'ethers';

export const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function balanceOf(address) view returns (uint)',
  'function decimals() view returns (uint)',
  'function transfer(address to, uint256 amount)',
];

export type providerType = ethers.providers.JsonRpcProvider;

export const getProvider = (walletProvider: EIP1193Provider) => {
  return new ethers.providers.Web3Provider(walletProvider) as providerType;
};

export const getSigner = (walletProvider: EIP1193Provider) => {
  const provider = getProvider(walletProvider);
  return provider.getSigner();
};
