import s from './index.module.scss';
import Amount from '@/components/atoms/dashboard/Amount';
import Asset from '@/components/atoms/dashboard/Asset';
import { ethers } from 'ethers';

export interface InputCheckTokenType {
  name: string;
  symbol: string;
  balance: string;
}
export default function InputCheckToken({ name, symbol, balance }: InputCheckTokenType) {
  return (
    <div>
      <div>
        <div>{name}</div>
        <div>{symbol}</div>
      </div>
      <div>{ethers.utils.formatUnits(balance, 6)}</div>
    </div>
  );
}
