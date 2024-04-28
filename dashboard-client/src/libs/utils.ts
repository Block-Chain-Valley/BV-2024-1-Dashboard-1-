import { ethers } from 'ethers';

export const addressToDetNum = (walletAddress: string, maxValue: number) => {
  const parsedHashValue = ethers.utils.keccak256(walletAddress).slice(-6);
  const decimal = parseInt(parsedHashValue, 16);
  return (decimal % maxValue) + 1;
};

export const reviseAddress = (walletAddress: string) => {
  return walletAddress.slice(0, 6).concat('...').concat(walletAddress.slice(-4));
};

export const formatSymbol = (symbol: string): string => {
  if (symbol.length > 7) {
    return `${symbol.slice(0, 5)}...`;
  }
  return symbol;
};

const MAX_AMOUNT = 9999999;
const MIN_AMOUNT = 0.0001;

export const isOverAmount = (amount: string): boolean => {
  return parseFloat(amount) > MAX_AMOUNT;
};

export const isUnderAmount = (amount: string): boolean => {
  const parsedValue = parseFloat(amount);
  return parsedValue < MIN_AMOUNT && parsedValue > 0;
};

export const formatAmount = (amount: string): string => {
  const [integer, decimal] = amount.split('.');

  if (isOverAmount(amount)) {
    return `${MAX_AMOUNT}`;
  }
  if (isUnderAmount(amount)) {
    return `${MIN_AMOUNT}`;
  }

  if (decimal && parseInt(decimal) !== 0) {
    const formattedDecimal = parseFloat(`0.${decimal}`)
      .toPrecision(5)
      .slice(2, -1)
      .replace(/\.?0+$/, '');
    return `${integer}.${formattedDecimal}`;
  } else {
    return integer;
  }
};
