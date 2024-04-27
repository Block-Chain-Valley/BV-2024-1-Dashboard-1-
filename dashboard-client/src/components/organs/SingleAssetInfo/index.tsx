import s from './index.module.scss';
import BaseButton from '@/components/atoms/button/BaseButton';
import Amount from '@/components/atoms/dashboard/Amount';
import Asset from '@/components/atoms/dashboard/Asset';
import { BigNumber, ethers } from 'ethers';

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
    <div className={s.single_asset_info}>
      <div className={s.asset_data}>
        <Asset address={props.address} symbol={props.symbol} name={props.name}></Asset>
        <Amount balance={props.balance} symbol={props.symbol}></Amount>
      </div>
      <div className={s.button_container}>
        {props.isEdit ? (
          <BaseButton
            assert
            name={'삭제'}
            onClick={props.onRemoveAsset}
            disabled={props.address === ethers.constants.AddressZero}
          ></BaseButton>
        ) : (
          <BaseButton name={'보내기'} onClick={props.onSendAsset} disabled={props.balance === '0.0'}></BaseButton>
        )}
      </div>
    </div>
  );
}
