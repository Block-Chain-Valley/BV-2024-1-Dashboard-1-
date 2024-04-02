import { ethers } from 'ethers';

const MAX_DECIMAL = 9_999_999;
const MIN_DECIMAL = 0.000_1;

export const addressToDetNum = (walletAddress: string, maxValue: number) => {
  const parsedHashValue = ethers.utils.keccak256(walletAddress).slice(-6);
  const decimal = parseInt(parsedHashValue, 16);
  return (decimal % maxValue) + 1;
};

export const reviseAddress = (walletAddress: string) => {
  return walletAddress.slice(0, 6).concat('...').concat(walletAddress.slice(-4));
};

export const formatBalance = (balance: string) => {
  const integer = balance.split('.')[0];
  const decimal = balance.split('.')[1];

  // OverDecimal & UnderDecimal
  if (isOverDecimal(balance)) {
    return MAX_DECIMAL;
  }
  if (isUnderDecimal(balance)) {
    return MIN_DECIMAL;
  }

  // 소수부분 있을 경우 -> 유효숫자 4개까지 표시
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

export const isOverDecimal = (balance: string) => parseFloat(balance) > MAX_DECIMAL;
export const isUnderDecimal = (balance: string) => parseFloat(balance) < MIN_DECIMAL;
