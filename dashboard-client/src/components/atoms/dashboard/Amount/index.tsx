import { SingleAssetInfoProps } from '../../../organs/SingleAssetInfo';
import s from './index.module.scss';

export default function Amount(props: SingleAssetInfoProps) {
  let balancenum: number = props.balance as unknown as number;
  let balancestr: string = props.balance;
  let balance: string = '';
  let overOrUnder: string = '';

  if (balancenum > 9999999) {
    balance = '9999999';
    overOrUnder = '@/public/assets/OverAmountIcon.png';
  } else if (balancenum < 0.0001) {
    balance = '0.0001';
    overOrUnder = '@/public/assets/UnderAmountIcon.png';
  } else {
    if (balancenum % 1 != 0) {
      balance = balancenum.toPrecision();
    } else {
      for (let i = 0; i < balancestr.length; i++) {
        let count = 0;
        if (balancestr[i] !== '0') {
          count++;
        }
        if (count == 4) {
          balance = balancestr.substring(0, i + 1) + '0'.repeat(balancestr.length - i - 1);
          break;
        }
      }
    }
    return (
      <div className={s.amount_container}>
        <div>
          <img src={overOrUnder} />
          <div className={s.amount}>{balance}</div>
          <div className={s.symbol}>{props.symbol}</div>
        </div>
      </div>
    );
  }
}
