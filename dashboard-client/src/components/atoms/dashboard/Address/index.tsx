import s from './index.module.scss';
import IconButton from '@/components/atoms/button/IconButton';
import { StatusToast } from '@/components/popups/Toast/StatusToast';
import CopyHoverIcon from '@/public/assets/CopyHoverIcon.png';
import CopyIcon from '@/public/assets/CopyIcon.png';
import Success from '@/public/assets/Success.png';
import { ToastContext } from '@/store/GlobalContext';
import copy from 'copy-to-clipboard';
import { useContext } from 'react';

export interface AddressProps {
  address: string;
}

export default function Address({ address }: AddressProps) {
  const [, setToast] = useContext(ToastContext);
  function handleCopy() {
    setToast(<StatusToast icon={Success} content="지갑 주소를 클립보드에 복사했어요." />);
    copy(address);
  }

  return (
    <div className={s.address_container}>
      <div className={s.address}>{address.substring(0, 6) + '...' + address.slice(-4)}</div>
      <IconButton icon={CopyIcon} hoverIcon={CopyHoverIcon} onClick={handleCopy} />
    </div>
  );
}
