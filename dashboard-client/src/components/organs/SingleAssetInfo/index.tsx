import s from './index.module.scss';
import Address from '@/components/atoms/dashboard/Address';
import Amount from '@/components/atoms/dashboard/Amount';
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
  const { onSendAsset, onRemoveAsset } = props;
  return (
    <div className={s.AssetInfo_container}>
      <div className={s.Add_bal_container}>
        <Asset address={props.address} symbol={props.symbol} name={props.name}></Asset>
        <Amount balance={props.balance} symbol={props.symbol}></Amount>
      </div>
      <button className="ButtonS1">
        <p onClick={onSendAsset}>보내기</p>
      </button>
      <button className="ButtonD1">
        <p onClick={onRemoveAsset}>삭제</p>
      </button>
    </div>
  );
}
