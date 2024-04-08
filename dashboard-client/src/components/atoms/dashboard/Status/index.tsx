import s from './index.module.scss';
import { TokenTransferStatus } from '@/libs/types';
import CopyIcon from '@/public/assets/CopyIcon.png';
import Image from 'next/image';

export interface AddressProps {
  status: TokenTransferStatus;
}

export default function Status({ status }: AddressProps) {
  return (
    <div className={s.status_container}>
      <div className={s.status_icon}>{status === 'DEPOSIT' ? '출금' : '입금'}</div>
    </div>
  );
}
