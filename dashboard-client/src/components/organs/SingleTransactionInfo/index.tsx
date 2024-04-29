import s from './index.module.scss';
import AddressContainer from '@/components/atoms/dashboard/Address';
import Amount from '@/components/atoms/dashboard/Amount';
import Asset from '@/components/atoms/dashboard/Asset';
import Date from '@/components/atoms/dashboard/Date';
import { TokenTransferStatus } from '@/libs/types';
import Ethereum from '@/public/assets/AssetLogoIcon/Ethereum.png';
import Image from 'next/image';

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
      <Asset address={props.assetAddress} symbol={props.symbol} name={props.name} />
      <AddressContainer address={props.targetAddress} status={props.status} />
      <Amount balance={props.amount} symbol={props.symbol} />
      <Date timestamp={0} />
    </div>
  );
}
