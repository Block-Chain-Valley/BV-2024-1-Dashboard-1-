import { UIProps } from '../../props';
import Address from '../Address';
import Status from '../Status';
import s from './index.module.scss';
import { TokenTransferStatus } from '@/libs/types';

interface AddressStatusProps extends UIProps.Div {
  address: string;
  status: TokenTransferStatus;
}

export default function AddressStatus(props: AddressStatusProps) {
  return (
    <div className={s.addressstatus_container}>
      <Address address={props.address} />
      <Status status={props.status} />
    </div>
  );
}
