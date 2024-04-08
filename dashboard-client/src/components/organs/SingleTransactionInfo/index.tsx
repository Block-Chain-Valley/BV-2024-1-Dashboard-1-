import Date from '@/components/atoms/Date';
import Address from '@/components/atoms/dashboard/Address';
import Status from '@/components/atoms/dashboard/Status';
import { TokenTransferStatus } from '@/libs/types';

export interface SingleTransactionInfoProps {
  assetAddress: string;
  symbol: string;
  name: string;
  targetAddress: string;
  status: TokenTransferStatus;
  amount: string;
  timestamp: number;
}

export default function SingleTransactionInfo(props: SingleTransactionInfoProps) {
  return (
    <div>
      <Status status={props.status}></Status>
      <Address address={props.assetAddress}></Address>
      <Date date={props.timestamp}></Date>
    </div>
  );
}
