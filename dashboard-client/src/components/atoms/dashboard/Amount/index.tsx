import { UIProps } from '../../props';
import s from './index.module.scss';

export interface AmountProps extends UIProps.Div {
  symbol: string;
  amount: string;
}

export default function Amount(props: AmountProps) {
  const { amount, symbol } = props;

  let newSymbol;
  if (symbol.length > 7) {
    newSymbol = symbol.slice(0, 5) + '...';
  } else {
    newSymbol = symbol;
  }

  let arrow = '';
  if (Number(amount) > 9999999) {
    arrow = s.overdecimal;
  } else if (Number(amount) < 0.0001) {
    arrow = s.underdecimal;
  }

  return (
    <div className={s.amount_container}>
      <p className={s.amount}>{amount}</p>
      <span className={s.amount_symbol}>{newSymbol}</span>
    </div>
  );
}
