import s from './index.module.scss';
import Amount from '@/components/atoms/dashboard/Amount';
import Asset from '@/components/atoms/dashboard/Asset';

export interface SingleAssetInfoModalProps {
  address: string;
  symbol: string;
  name: string;
  balance: string;
}

export default function SingleAssetInfoModal(props: SingleAssetInfoModalProps) {
  const { address, symbol, name, balance } = props;

  return (
    <div className={s.container}>
      <Asset address={address} symbol={symbol} name={name} />
      <Amount symbol={symbol} amount={balance} />
    </div>
  );
}
