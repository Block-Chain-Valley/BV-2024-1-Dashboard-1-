import s from './index.module.scss';
import Address from '@/components/atoms/dashboard/Address';
import Status from '@/components/atoms/dashboard/Status';
import { TokenTransferStatus } from '@/libs/types';

export interface dateProps {
  date: number;
}

export default function Date({ date }: dateProps) {
  return <div className={s.date_container}>{date}</div>;
}
