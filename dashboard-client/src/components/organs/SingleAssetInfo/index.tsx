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
  const text = props.isEdit ? '삭제' : '보내기';
  const buttonstyle = props.isEdit ? s.button_remove : s.button_send;

  return (
    <div className={s.singleasset_container}>
      <Asset address={props.address} symbol={props.symbol} name={props.name}></Asset>
      <div className={s.singleasset_right}>
        <Amount balance={props.balance} symbol={props.symbol}></Amount>
        <div className={s.buttonarea}>
          <button
            onClick={props.isEdit ? props.onRemoveAsset : props.onSendAsset}
            disabled={!props.isEdit && props.balance === '0.0'}
            className={`${s.button} ${buttonstyle}`}
          >
            {text}
          </button>
        </div>
      </div>
    </div>
  );
}
