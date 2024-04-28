import s from './index.module.scss';
import { UIProps } from '@/components/atoms/props';
import { formatAmount, formatSymbol, isOverAmount, isUnderAmount } from '@/libs/utils';
import classNames from 'classnames/bind';

const cx = classNames.bind(s);

export interface AmountProps extends UIProps.Div {
  symbol: string;
  amount: string;
}

export default function Amount(props: AmountProps) {
  const { symbol, amount } = props;

  let amountState = '';
  if (isOverAmount(amount)) {
    amountState = 'over';
  } else if (isUnderAmount(amount)) {
    amountState = 'under';
  }

  const formattedSymbol = formatSymbol(symbol);
  const formattedAmout = formatAmount(amount);

  return (
    <div className={s.amount_container}>
      <p className={cx('amount', amountState)}>{formattedAmout}</p>
      <span className={s.amount_symbol}>{formattedSymbol}</span>
    </div>
  );
}
