import s from './index.module.scss';
import OverAmountIcon from '@/public/assets/OverAmountIcon.png';
import UnderAmountIcon from '@/public/assets/UnderAmountIcon.png';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface AmountProps {
  symbol: string;
  amount: string;
}

export default function Amount(props: AmountProps): JSX.Element {
  const { amount, symbol } = props;
  const [isOverDecimal, setIsOverDecimal] = useState<boolean>(false);
  const [isUnderDecimal, setIsUnderDecimal] = useState<boolean>(false);
  const [checkedDecimal, setCheckedDecimal] = useState<string>(amount);

  useEffect(() => {
    checkAmount(amount);
  }, [amount]);

  const checkAmount = (amount: string) => {
    const integer = amount.split('.')[0];
    const decimal = amount.split('.')[1];

    if (integer === '0') {
      //소수점 이하 자리 고려
      let calculatedDecimal = parseFloat(`${integer}.${decimal}`).toFixed(4);
      calculatedDecimal = calculatedDecimal.replace(/\.?0+$/, '');
      setCheckedDecimal(calculatedDecimal);
    } else {
      //integer가 0이 아닌 경우
      const nonZeroCount = (integer.match(/[1-9]/g) || []).length; //정수자리에서의 0이 아닌 수의 개수
      if (nonZeroCount >= 4) {
        //정수자리에서 0이 아닌 수가 4개 이상이면 정수자리에서 4개만 출력
        const nonZeroIndex = integer.search(/[1-9]/);
        const firstFourDigits = integer.substring(nonZeroIndex, nonZeroIndex + 4);
        setCheckedDecimal(firstFourDigits.padEnd(integer.length, '0'));
      } else {
        //정수자리에서 0이 아닌 수가 4개보다 적은 경우 소수점 자리도 함께 고려
        const nonZeroDecimalCount = (decimal.match(/[1-9]/g) || []).length;
        if (nonZeroCount + nonZeroDecimalCount >= 4) {
          const firstFourDigits = integer + (decimal ? `.${decimal}` : '');
          const trimmedAmount = firstFourDigits.substring(0, 5);
          setCheckedDecimal(trimmedAmount);
        } else {
          const checkedAmount = integer + (decimal ? `.${decimal}` : '');
          setCheckedDecimal(checkedAmount);
        }
      }
    }

    if (parseFloat(amount) > 9999999) {
      setIsOverDecimal(true);
    } else {
      setIsOverDecimal(false);
    }

    if (parseFloat(amount) < 0.0001) {
      setIsUnderDecimal(true);
    } else {
      setIsUnderDecimal(false);
    }
  };

  const truncatedSymbol = symbol.length > 7 ? `${symbol.slice(0, 5)}...` : symbol;

  return (
    <div className={s.container}>
      {isOverDecimal || isUnderDecimal ? (
        <div className={s.amount_decimal}>
          <Image
            src={isOverDecimal ? OverAmountIcon : UnderAmountIcon}
            alt={isOverDecimal ? 'Over Amount' : 'Under Amount'}
            className="amount_icon"
            width={13}
            height={13}
          />
          <p className={s.amount}>{checkedDecimal}</p>
        </div>
      ) : (
        <p className={s.amount}>{checkedDecimal}</p>
      )}
      <span className={s.amount_symbol}>{truncatedSymbol}</span>
    </div>
  );
}
