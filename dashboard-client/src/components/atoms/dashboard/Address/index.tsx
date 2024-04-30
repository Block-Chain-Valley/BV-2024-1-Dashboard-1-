import IconButton from '../../button/IconButton';
import s from './index.module.scss';
import { StatusToast } from '@/components/popups/Toast/StatusToast';
import { ToastContext } from '@/store/GlobalContext';
import copy from 'copy-to-clipboard';
import CopyHoverIcon from 'dashboard-client/public/assets/CopyHoverIcon.png';
import CopyIcon from 'dashboard-client/public/assets/CopyIcon.png';
import Success from 'dashboard-client/public/assets/Success.png';
import { useContext } from 'react';

interface AddressContainerProps {
  address: string;
  status: string;
}
export function Address({ address }: { address: string }) {
  const [, setToast] = useContext(ToastContext);
  const handleCopy = () => {
    copy(address);
    setToast(<StatusToast icon={Success} content="지갑 주소를 클립보드에 복사했어요." />);
  };
  return (
    <div className={s.address_container}>
      <div className={s.address_address}>{formatAddress(address)}</div>
      <IconButton icon={CopyIcon} hoverIcon={CopyHoverIcon} onClick={handleCopy} />
    </div>
  );
}
export function Status({ status }: { status: string }) {
  if (status === '입금') return <div className={s.status_containeri}>입금</div>;
  else if (status === '출금') return <div className={s.status_containero}>출금</div>;
}
function formatAddress(address: string) {
  return address.slice(0, 6) + '...' + address.slice(-4);
}

export default function AddressContainer({ address, status }: AddressContainerProps) {
  return (
    <div className={s.addressContainer_container}>
      <Address address={address} />
      <Status status={status} />
    </div>
  );
}
