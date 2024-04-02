import { UIProps } from '../../props';
import s from './index.module.scss';
import { TokenTransferStatusTranslator } from '@/libs/translator';
import { TokenTransferStatus } from '@/libs/types';
import classNames from 'classnames/bind';

const cx = classNames.bind(s);

export interface StatusProps extends UIProps.Label {
  status: TokenTransferStatus;
}

export default function Status(props: StatusProps) {
  const { status } = props;

  return <label className={cx('status', status.toLocaleLowerCase())}>{TokenTransferStatusTranslator[status]}</label>;
}
