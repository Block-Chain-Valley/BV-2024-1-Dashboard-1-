import s from './index.module.scss';
import IconButton from '@/components/atoms/button/IconButton';
import { StatusToast } from '@/components/popups/Toast/StatusToast';
import Success from '@/public/assets/Success.png';
import { ToastContext } from '@/store/GlobalContext';
import copy from 'copy-to-clipboard';
import { useContext } from 'react';

export interface addressprops {
  assetAddress: string;
  targetAddress: string;
}

export default function AddressStatus({ assetAddress, targetAddress }: addressprops) {
  const [, setToast] = useContext(ToastContext);
  let myaddress =
    assetAddress.substring(0, 3) + '...' + assetAddress.substring(assetAddress.length - 4, assetAddress.length - 1);
  let sendaddress =
    targetAddress.substring(0, 3) + '...' + targetAddress.substring(targetAddress.length - 4, targetAddress.length - 1);
  let handleCopyAsset = () => {
    setToast(<StatusToast icon={Success} content="지갑 주소를 클립보드에 복사했어요." />);
    copy(assetAddress);
  };
  let handleCopyTarget = () => {
    setToast(<StatusToast icon={Success} content="지갑 주소를 클립보드에 복사했어요." />);
    copy(targetAddress);
  };

  let copyIcon = '../../../../../public/assets/CopyIcon.png';
  let copyHoverIcon = '../../../../../public/assets/CopyHoverIcon.png';

  return (
    <div className={s.addressStatusContainer}>
      <div className={s.addressStatus}>
        <div className={s.addressAndCopy}>
          <text>{myaddress}</text>
          <IconButton icon={require(copyIcon)} hoverIcon={require(copyHoverIcon)} onClick={handleCopyAsset} />
        </div>
        <div className={s.status}>입금</div>
      </div>
      <div className={s.addressStatus}>
        <div className={s.addressAndCopy}>
          <text>{sendaddress}</text>
          <IconButton icon={require(copyIcon)} hoverIcon={require(copyHoverIcon)} onClick={handleCopyTarget} />
        </div>
        <div className={s.status}>출금</div>
      </div>
    </div>
  );
}
