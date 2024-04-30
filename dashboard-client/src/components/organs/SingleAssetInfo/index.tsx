import s from './index.module.scss';
import BaseButton from '@/components/atoms/button/BaseButton';
import Amount from '@/components/atoms/dashboard/Amount';
import Asset from '@/components/atoms/dashboard/Asset';
import Ethereum from '@/public/assets/AssetLogoIcon/Ethereum.png';
import Image from 'next/image';

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
    <div className={s.singleassetinfo_container}>
      <Asset address={props.address} symbol={props.symbol} name={props.name} />
      <Amount balance={props.balance} symbol={props.symbol} />
      {props.isEdit ? (
        <BaseButton name="삭제" assert={true} style={{ marginLeft: '12px' }} onClick={props.onRemoveAsset} />
      ) : (
        <BaseButton name="보내기" assert={false} onClick={props.onSendAsset} />
      )}
    </div>
  );
}
