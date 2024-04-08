import s from './index.module.scss';
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
  return (
    <div className={s.Assetinfo_container}>
      <div className={s.Assetinfo}>
        <Asset address={props.address} symbol={props.symbol} name={props.name}></Asset>
        <Amount symbol={props.symbol} balance={props.balance}></Amount>
      </div>
      <div className={s.button_container}>
        {props.isEdit ? (
          <button onClick={props.onRemoveAsset}>삭제</button>
        ) : (
          <button onClick={props.onSendAsset}>보내기</button>
        )}
      </div>
    </div>
  );
}
