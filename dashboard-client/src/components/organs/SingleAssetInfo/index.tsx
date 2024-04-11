import s from './index.module.scss';
import BaseButton from '@/components/atoms/button/BaseButton';
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
//<Datetime timestamp={1712454116}/>

export default function SingleAssetInfo(props: SingleAssetInfoProps) {
  return (
    <div className={s.singleassetinfo_container}>
      <Asset symbol={props.symbol} name={props.name} address={props.address}></Asset>
      <Amount amount={props.balance} symbol={props.symbol}></Amount>
      <BaseButton assert={props.isEdit} name={props.isEdit ? '삭제' : '보내기'} />
    </div>
  );
}
