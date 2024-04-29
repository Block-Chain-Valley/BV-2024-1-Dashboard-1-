import s from './index.module.scss';
import Amount from '@/components/atoms/dashboard/Amount';
import Asset from '@/components/atoms/dashboard/Asset';
import Message from '@/components/atoms/dashboard/Message';
import { AddAssetModalStatus } from '@/libs/types';

export interface AddAssetInfoProps {
  assetInfo: {
    address: string;
    symbol: string;
    name: string;
    balance: string;
  } | null;
  status: AddAssetModalStatus;
}

export default function AddAssetInfo(props: AddAssetInfoProps) {
  const { assetInfo, status } = props;

  return (
    <div className={s.container}>
      <Message status={status} />
      {assetInfo && (
        <div className={s.asset_container}>
          <Asset address={assetInfo.address} symbol={assetInfo.symbol} name={assetInfo.name} />
          <Amount symbol={assetInfo.symbol} amount={assetInfo.balance} />
        </div>
      )}
    </div>
  );
}
