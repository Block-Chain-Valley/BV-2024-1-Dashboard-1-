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
  const { address, status } = props;

  return (
    <div className={s.address_status}>
      <Address address={address} />
      <Status status={status} />
    </div>
  );
}
