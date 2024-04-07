import s from './index.module.scss';
import AddressStatus from '@/components/atoms/dashboard/AddressStatus';
import Amount from '@/components/atoms/dashboard/Amount';
import Asset from '@/components/atoms/dashboard/Asset';
import Date from '@/components/atoms/dashboard/Date';
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
    <div className={s.SingleTransaction_container}>
      <Asset address={props.assetAddress} symbol={props.symbol} name={props.name}></Asset>
      <AddressStatus address={props.assetAddress} status={props.status}></AddressStatus>
      <Amount balance={props.amount} symbol={props.symbol}></Amount>
      <Date timestamp={props.timestamp}></Date>
    </div>
  );
}
