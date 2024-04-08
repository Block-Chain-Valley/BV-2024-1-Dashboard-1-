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
    <div>
      <Asset address={props.address} symbol={props.symbol} name={props.name}></Asset>
      <Amount balance={props.balance} symbol={props.symbol}></Amount>
    </div>
  );
}
