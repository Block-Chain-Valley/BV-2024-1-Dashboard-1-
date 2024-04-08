import { UIProps } from '../../props';
import s from './index.module.scss';
import { TokenTransferStatus } from '@/libs/types';

export interface StausProps extends UIProps.Div {
  status: TokenTransferStatus;
}

export default function Status({ status }: StausProps) {
  return status === TokenTransferStatus.WITHDRAW ? (
    <div className={s.status_container_withdraw}>
      <span className={s.status_withdraw}>withdraw</span>
    </div>
  ) : (
    <div className={s.status_container_deposit}>
      <span className={s.status_deposit}>deposit</span>
    </div>
  );
}
