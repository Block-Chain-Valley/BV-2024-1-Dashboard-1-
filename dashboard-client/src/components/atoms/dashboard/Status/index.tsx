import s from './index.module.scss';
import { TokenTransferStatus } from '@/libs/types';

export interface AmountProps {
  status: TokenTransferStatus;
}

export default function Status({ status }: AmountProps) {
  return (
    <div className={s.status_container}>
      <div className={s.status}>{status === TokenTransferStatus.DEPOSIT ? '입금' : '출금'}</div>
    </div>
  );
}
