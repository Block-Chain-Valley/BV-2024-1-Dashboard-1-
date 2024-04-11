import s from './index.module.scss';
import AddressStatus from '@/components/atoms/dashboard/AddressStatus';
import Amount from '@/components/atoms/dashboard/Amount';
import Asset from '@/components/atoms/dashboard/Asset';
import Datetime from '@/components/atoms/dashboard/Date';
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
    <div className={s.singletransactioninfo_container}>
      <Asset symbol={props.symbol} name={props.name} address={props.assetAddress}></Asset>
      <AddressStatus address={props.targetAddress} status={props.status}></AddressStatus>
      <Amount amount={props.amount} symbol={props.symbol}></Amount>
      <Datetime timestamp={props.timestamp} />
    </div>
  );
}
