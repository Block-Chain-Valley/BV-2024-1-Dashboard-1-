import s from './index.module.scss';
import Overamount from '@/public/assets/OverAmountIcon.png';
import Underamount from '@/public/assets/UnderAmountIcon.png';
import Image from 'next/image';

export interface AmountProps {
  amount: string;
  symbol: string;
}

function formatAmount(num: number): string {
  if (num > 9999999) {
    return '9999999';
  } else if (num < 0.0001) {
    return '0.0001';
  }

  const [integerPart, decimalPart] = num.toString().split('.');

  if (decimalPart) {
    const formatdecimal = parseFloat(decimalPart)
      .toPrecision(4)
      .replace(/\.?0+$/, '');
    return `${integerPart}.${formatdecimal}`;
  } else {
    return num.toString();
  }
}

export default function Amount({ amount, symbol }: AmountProps) {
  const amount_num = parseInt(amount);
  return (
    <div className={s.amount_container}>
      <div className={s.amount}>
        {amount_num > 9999999 ? <Image src={Overamount} alt="" width={13} height={13} /> : ''}
        {amount_num < 0.0001 ? <Image src={Underamount} alt="" width={13} height={13} /> : ''}
        {formatAmount(amount_num)}
      </div>
      <div className={s.amount_name}>{symbol.length > 7 ? symbol.substring(0, 5) + '...' : symbol}</div>
    </div>
  );
}
