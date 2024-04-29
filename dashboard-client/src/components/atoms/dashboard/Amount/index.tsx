import s from './index.module.scss';
import OverAmountIcon from '@/public/assets/OverAmountIcon.png';
import UnderAmountIcon from '@/public/assets/UnderAmountIcon.png';
import Image from 'next/image';

export interface AmountProps {
  balance: string;
  symbol: string;
}

function formatBalance(balance: string): string {
  const parsedBalance = parseFloat(balance);
  if (parsedBalance > 9999999) {
    return '9999999';
  } else if (parsedBalance < 0.0001 && parsedBalance > 0) {
    return '0.0001';
  }

  const [intPart, decPart] = balance.split('.');
  if (!decPart) {
    if (intPart.length > 4) {
      return intPart.slice(0, 4) + '0'.repeat(intPart.length - 4);
    } else {
      return intPart;
    }
  }

  const formattedDecPart = decPart.slice(0, 4);
  const trimmedDecPart = formattedDecPart.replace(/0+$/, '');

  return trimmedDecPart.length > 0 ? `${intPart}.${trimmedDecPart}` : intPart;
}

function formatSymbol(symbol: string): string {
  return symbol.length > 7 ? symbol.slice(0, 5) + '...' : symbol;
}

export function getIcon(balance: string) {
  const parsedBalance = parseFloat(balance);

  if (parsedBalance > 9999999) {
    return <Image src={OverAmountIcon} alt="OverAmountIcon" width={13} height={13} />;
  } else if (parsedBalance < 0.0001 && parsedBalance > 0) {
    return <Image src={UnderAmountIcon} alt="UnderAmountIcon" width={13} height={13} />;
  } else {
    return null;
  }
}

export default function Amount({ balance, symbol }: AmountProps) {
  const formattedBalance = formatBalance(balance);
  const formattedSymbol = formatSymbol(symbol);
  const icon = getIcon(balance);

  return (
    <div className={s.amount_container}>
      <div className={s.amount}>
        {icon}
        {formattedBalance}
      </div>
      <div className={s.amount_symbol}>
        <div className={s.amount_unit}>{formattedSymbol}</div>
      </div>
    </div>
  );
}
