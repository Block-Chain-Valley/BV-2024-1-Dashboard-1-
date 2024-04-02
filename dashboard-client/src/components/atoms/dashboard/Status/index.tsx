import { UIProps } from '../../props';
import s from './index.module.scss';
import { TokenTransferStatusTranslator } from '@/libs/translator';
import { TokenTransferStatus } from '@/libs/types';

export interface StatusProps extends UIProps.Label {
  status: TokenTransferStatus;
}

export default function Status(props: StatusProps) {
  const { status } = props;

  return (
    <label className={`${s.status} ${s[status.toLocaleLowerCase()]}`}>{TokenTransferStatusTranslator[status]}</label>
  );
}
