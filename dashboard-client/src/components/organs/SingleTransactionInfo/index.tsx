import s from './index.module.scss';
import Asset from '@/components/atoms/dashboard/Asset';
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
      <Image src={Ethereum} alt="ethereum" width={20} height={20} />
      <div className={s.singletransactioninfo}>
        <div className={s.singletransactioninfo_symbol}>ETH</div>
        <div className={s.singletransactioninfo_name}>Ethereum</div>
      </div>
    </div>
  );
}
