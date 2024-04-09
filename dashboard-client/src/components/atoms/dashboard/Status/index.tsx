import { UIProps } from '../../props';
import s from './index.module.scss';
import { TokenTransferStatus } from '@/libs/types';

export interface StatusProps {
  status: TokenTransferStatus;
}

export default function Status({ status }: StatusProps) {
  return <label className={s.status}>{status}</label>;
}
