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
      {/* <Amount amount="99999999" symbol="ETH"></Amount> */}
      <Asset symbol={props.symbol} name={props.name} address={props.address}></Asset>
    </div>
  );
}
