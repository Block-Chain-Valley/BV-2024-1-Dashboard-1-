import s from './index.module.scss';
import OverIcon from '@/public/assets/OverAmountIcon.png';
import UnerIcon from '@/public/assets/UnderAmountIcon.png';
import Image from 'next/image';

export interface AmountProps {
  balance: string;
  symbol: string;
}
function balance_patch(balance: string): string {
  let new_balance = parseFloat(balance);
  if (Number.isInteger(new_balance)) {
    return new_balance.toString();
  } else {
    let decimalPart = balance.split('.')[1];
    if (decimalPart.length > 4) {
      decimalPart = decimalPart.slice(0, 4);
    }
    let formattedBalance = balance.split('.')[0] + '.' + decimalPart;
    formattedBalance = formattedBalance.replace(/(\.[0-9]*[1-9])0+$/, '$1');
    return formattedBalance;
  }
}

function is_big(balance: string): Number {
  let new_balance = parseFloat(balance);
  if (new_balance > 9999999) {
    return 1;
  } else if (new_balance < 0.0001) {
    return 2;
  }

  return 3;
}
function symbol_patch(symbol: string): string {
  if (symbol.length > 7) {
    return symbol.slice(0, 4) + '...';
  }
  return symbol;
}

export default function Amount({ symbol, balance }: AmountProps) {
  let imageicon;
  if (is_big(balance) == 1) {
    imageicon = <Image className={s.image} src={OverIcon} alt="OverAmountIcon" />;
  } else if (is_big(balance) == 2) {
    imageicon = <Image className={s.image} src={UnerIcon} alt="UderAmountIcon" />;
  } else {
    imageicon = <div></div>;
  }
  return (
    <div className={s.amount_container}>
      {imageicon}
      <div className={s.balance}>{balance_patch(balance)}</div>
      <div className={s.symbol}>{symbol_patch(symbol)}</div>
    </div>
  );
}
