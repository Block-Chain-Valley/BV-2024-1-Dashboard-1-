import Address from '../Address';
import Status from '../Status';
import s from './index.module.scss';
import { TokenTransferStatus } from '@/libs/types';

export interface AmountProps {
  address: string;
  status: TokenTransferStatus;
}

export default function AddressStatus({ address, status }: AmountProps) {
  return (
    <div className={s.addressstatus_container}>
      <Address address={address} />
      <Status status={status} />
    </div>
  );
}
