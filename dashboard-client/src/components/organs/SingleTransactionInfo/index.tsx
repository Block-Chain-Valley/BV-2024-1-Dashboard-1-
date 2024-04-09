import s from './index.module.scss';
import Address from '@/components/atoms/dashboard/Address';
import Addressstatus from '@/components/atoms/dashboard/Addressstatus';
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
    <div className={s.Tran_Info_container}>
      <Asset address={props.assetAddress} symbol={props.symbol} name={props.name}></Asset>
      <Addressstatus address={props.targetAddress} status={props.status}></Addressstatus>
      <Amount symbol={props.symbol} balance={props.amount}></Amount>
      <Date timestamp={props.timestamp}></Date>
    </div>
  );
}
