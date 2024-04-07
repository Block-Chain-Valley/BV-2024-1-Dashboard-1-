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

export default function SingleAssetInfo(props: SingleAssetInfoProps) {
  const { address, symbol, name, balance, isEdit, onSendAsset, onRemoveAsset } = props;

  return (
    <div className={s.container}>
      <div className={s.asset_container}>
        <Asset address={address} symbol={symbol} name={name} />
        <Amount symbol={symbol} amount={balance} />
      </div>
      <div className={s.button}>
        {isEdit ? (
          <BaseButton assert name="삭제" onClick={onRemoveAsset} />
        ) : (
          <BaseButton name="보내기" onClick={onSendAsset} />
        )}
      </div>
    </div>
  );
}
