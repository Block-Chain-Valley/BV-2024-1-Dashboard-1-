import BaseButton from '@/components/atoms/button/BaseButton';
import Amount from '@/components/atoms/dashboard/Amount';
import Asset from '@/components/atoms/dashboard/Asset';
import s from '@/components/organs/SingleAssetInfo/index.module.scss';
import { ethers } from 'ethers';

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
  const { address, symbol, name, balance, isEdit, onSendAsset, onRemoveAsset } = props;

  return (
    <div className={s.container}>
      <div className={s.asset_data}>
        <Asset address={address} symbol={symbol} name={name} />
        <Amount symbol={symbol} amount={balance} />
      </div>
      <div className={s.button_container}>
        {isEdit ? (
          <BaseButton assert name="삭제" onClick={onRemoveAsset} disabled={address === ethers.constants.AddressZero} />
        ) : (
          <BaseButton name="보내기" onClick={onSendAsset} disabled={Number(balance) === 0} />
        )}
      </div>
    </div>
  );
}
