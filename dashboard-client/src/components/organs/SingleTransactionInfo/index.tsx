import AddressContainer from '../../atoms/AddressStatus';
import Amount from '../../atoms/Amount/index.jsx';
import styles from './index.module.scss';
import Asset from '@/components/atoms/dashboard/Asset';
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
    <div className={styles.singleTransactionInfo}>
      <Asset address={props.assetAddress} symbol={props.symbol} name={props.name}></Asset>
      <AddressContainer address={props.targetAddress} status={props.status} />
      <Amount amount={props.amount} symbol={props.symbol} />
      {/* Additional components will go here */}
    </div>
  );
}
