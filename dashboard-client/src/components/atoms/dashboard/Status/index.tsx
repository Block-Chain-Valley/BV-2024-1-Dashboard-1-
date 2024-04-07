import s from './index.module.scss';
import { TokenTransferStatus } from '@/libs/types';

export interface StatusProps {
  status: TokenTransferStatus;
}

export default function Status({ status }: StatusProps) {
  switch (status) {
    case TokenTransferStatus.DEPOSIT:
      return <p className={s.deposit}>입금</p>;
    case TokenTransferStatus.WITHDRAW:
      return <p className={s.withdraw}>출금</p>;
    default:
      return <div></div>;
  }
}
