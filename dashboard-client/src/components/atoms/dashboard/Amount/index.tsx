import { UIProps } from '../../props';
import s from './index.module.scss';
import { ethers } from 'ethers';

export interface AmountProps {
  symbol: string;
  balance: string;
}

export default function Amount({ symbol, balance }: AmountProps) {
  return (
    <div className={s.amount_container}>
      <div className={s.amount_degit}>{balance}</div>
      <div className={s.amount_unit}>{symbol}</div>
    </div>
  );
}
