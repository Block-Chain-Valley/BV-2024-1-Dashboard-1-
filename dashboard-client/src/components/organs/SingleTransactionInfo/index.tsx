import s from './index.module.scss';
import AddressStatus from '@/components/atoms/dashboard/AddressAndStatus';
import Amount from '@/components/atoms/dashboard/Amount';
import TransactionTime from '@/components/atoms/dashboard/Date';
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
    <div className={s.stinfocontainer}>
      <div className={s.iconandname}>
        <img className={s.logo} src="../../../../public/assets/AssetLogoIcon/Ethereum.png" alt="EtherumIcon" />
        <div className={s.tickerandname}>
          <div className={s.ticker}>{props.symbol}</div>
          <div className={s.fullname}>{props.name}</div>
        </div>
      </div>
      <AddressStatus assetAddress={props.assetAddress} targetAddress={props.targetAddress} />
      <Amount balance={props.amount} symbol={props.symbol} />
      <TransactionTime timestamp={props.timestamp} />
    </div>
  );
}
