import { UIProps } from '../../props';
import s from './index.module.scss';
import IconButton from '@/components/atoms/button/IconButton';
import { StatusToast } from '@/components/popups/Toast/StatusToast';
import { reviseAddress } from '@/libs/utils';
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
  const handleCopy = () => {
    copy(address);
    setToast(<StatusToast icon={Success} content="지갑 주소를 클립보드에 복사했어요." />);
  };
  return (
    <div className={s.address_container}>
      <p className={s.address}>{reviseAddress(address)}</p>
      <IconButton icon={CopyIcon} hoverIcon={CopyHoverIcon} onClick={handleCopy} />
    </div>
  );
}
