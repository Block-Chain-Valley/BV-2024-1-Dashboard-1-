import { UIProps } from '../../props';
import s from './index.module.scss';
import { formatBalance, isOverDecimal, isUnderDecimal } from '@/libs/utils';

export interface AmountProps extends UIProps.Div {
  symbol: string;
  balance: string;
}

export default function Amount(props: AmountProps) {
  const { balance, symbol } = props;

  const balanceClassName = isOverDecimal(balance) ? 'over' : isUnderDecimal(balance) ? 'under' : '';
  const truncatedSymbol = symbol.length > 7 ? symbol.slice(0, 5) + '...' : symbol;

  return (
    <div className={s.amount_container}>
      <p className={`${s.amount_balance} ${s[balanceClassName]}`}>{formatBalance(balance)}</p>
      <span className={s.amount_symbol}>{truncatedSymbol}</span>
    </div>
  );
}
