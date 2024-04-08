import s from './index.module.scss';
import Address from '@/components/atoms/dashboard/Address';
import Status from '@/components/atoms/dashboard/Status';
import { TokenTransferStatus } from '@/libs/types';

export interface Address_StatusProps {
  status: TokenTransferStatus;
  address: string;
}

export default function Address_Status({ address, status }: Address_StatusProps) {
  return (
    <div className={s.Address_Status_container}>
      <Address address={address} />
      <Status status={status} />
    </div>
  );
}
