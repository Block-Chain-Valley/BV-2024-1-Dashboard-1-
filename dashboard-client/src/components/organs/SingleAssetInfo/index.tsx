import s from './index.module.scss';
import { useState } from 'react';

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
  const buttonkind = props.isEdit ? 's.sendbutton' : 's.deletebutton';
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(!isClicked);
    isClicked ? props.onSendAsset : props.onRemoveAsset;
  };

  return (
    <div className={s.singleassetinfocontainer}>
      <div className={s.assetandamount}>
        <div className={s.iconandname}>
          <img className={s.logo} src="../../../../public/assets/AssetLogoIcon/Ethereum.png" alt="EtherumIcon" />
          <div className={s.tickerandname}>
            <div className={s.ticker}>{props.symbol}</div>
            <div className={s.fullname}>{props.name}</div>
          </div>
        </div>
        <div className={s.balanceandunit}>
          <div className={s.assetbalance}>{props.balance}</div>
          <div className={s.assetbalanceunit}>{props.symbol}</div>
        </div>
      </div>
      <button className={buttonkind} onClick={handleClick}>
        {props.isEdit ? '보내기' : '삭제'}
      </button>
    </div>
  );
}
