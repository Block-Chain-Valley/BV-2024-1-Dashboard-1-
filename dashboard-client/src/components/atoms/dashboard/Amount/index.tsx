import { UIProps } from '../../props';
import s from './index.module.scss';

export interface AmountProps extends UIProps.Div {
  symbol: string;
  balance: string;
}

export function balanceFormat(balance: string) {
  let number = parseFloat(balance);
  if (number > 9999999) {
    return 'OverDecimal';
  } else if (number < 0.0001 && number > 0) {
    return 'UnderDecimal';
  } else {
    let formattedNumber;
    if (number % 1 === 0) {
      formattedNumber = number.toString();
    } else {
      let significantnum = number.toPrecision(4);
      formattedNumber = parseFloat(significantnum).toString();
    }
    return formattedNumber;
  }
}

export function symbolFormat(symbol: string) {
  return symbol.length > 7 ? `${symbol.substring(0, 5)}...` : symbol;
}

export default function Amount({ symbol, balance }: AmountProps) {
  return (
    <div className={s.amount_container}>
      <div className={s.amount_count}>{balanceFormat(balance)}</div>
      <div className={s.amount_symbol}>{symbolFormat(symbol)}</div>
    </div>
  );
}
