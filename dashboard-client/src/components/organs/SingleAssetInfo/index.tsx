import Amount from '../../atoms/Amount/index';
import style from './index.module.scss';
import Asset from '@/components/atoms/dashboard/Asset';

export interface SingleAssetInfoProps {
  address: string;
  symbol: string;
  name: string;
  balance: string;
  isEdit: boolean;
  onSendAsset: () => void;
  onRemoveAsset: () => void;
}

export default function SingleAssetInfo(props: SingleAssetInfoProps) {
  return (
    <div className={style.assetInfo}>
      <Asset address={props.address} symbol={props.symbol} name={props.name}></Asset>
      <Amount amount={props.balance} symbol={props.symbol} />
    </div>
  );
}
