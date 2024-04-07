import Address from '@/components/atoms/dashboard/Address';
import Amount from '@/components/atoms/dashboard/Amount';
import Asset from '@/components/atoms/dashboard/Asset';
import Date from '@/components/atoms/dashboard/Date';
import s from '@/components/organs/SingleTransactionInfo/index.module.scss';
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
  const { assetAddress, symbol, name, targetAddress, status, amount, timestamp } = props;

  return (
    <div className={s.container}>
      <Asset address={assetAddress} symbol={symbol} name={name} />
      <Address address={targetAddress} status={status} />
      <Amount symbol={symbol} amount={amount} />
      <Date timestamp={timestamp} />
    </div>
  );
}
