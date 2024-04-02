import { UIProps } from '../../props';
import s from './index.module.scss';
import { formatAmount, isOverDecimal, isUnderDecimal } from '@/libs/utils';
import classNames from 'classnames/bind';

const cx = classNames.bind(s);

export interface AmountProps extends UIProps.Div {
  symbol: string;
  amount: string;
}

export default function Amount(props: AmountProps) {
  const { amount, symbol } = props;

  const amountClassName = isOverDecimal(amount) ? 'over' : isUnderDecimal(amount) ? 'under' : '';
  const truncatedSymbol = symbol.length > 7 ? symbol.slice(0, 5) + '...' : symbol;

  return (
    <div className={s.amount_container}>
      <p className={cx('amount', amountClassName)}>{formatAmount(amount)}</p>
      <span className={s.amount_symbol}>{truncatedSymbol}</span>
    </div>
  );
}
