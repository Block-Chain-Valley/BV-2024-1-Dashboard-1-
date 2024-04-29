import s from './index.module.scss';
import IconButton from '@/components/atoms/button/IconButton';
import { StatusToast } from '@/components/popups/Toast/StatusToast';
import { TokenTransferStatus } from '@/libs/types';
import CopyHoverIcon from '@/public/assets/CopyHoverIcon.png';
import CopyIcon from '@/public/assets/CopyIcon.png';
import Success from '@/public/assets/Success.png';
import { ToastContext } from '@/store/GlobalContext';
import copy from 'copy-to-clipboard';
import { useContext } from 'react';

export interface AddressProps {
  address: string;
}

export function Address({ address }: AddressProps) {
  const formattedAddress = '0x' + address.slice(0, 4) + '...' + address.slice(-4);
  const [, setToast] = useContext(ToastContext);

  function handleCopy() {
    copy(address);
    setToast(<StatusToast icon={Success} content="지갑 주소를 클립보드에 복사했어요." />);
  }

  return (
    <div className={s.address_container}>
      <div className={s.address}>{formattedAddress}</div>
      <IconButton icon={CopyIcon} hoverIcon={CopyHoverIcon} onClick={handleCopy} />
    </div>
  );
}

export interface StatusProps {
  status: TokenTransferStatus;
}

export function Status({ status }: StatusProps) {
  const transferStatus = status === TokenTransferStatus.DEPOSIT ? s.status_deposit : s.status_withdraw;
  const text = status === TokenTransferStatus.DEPOSIT ? '입금' : '출금';

  return <div className={`${s.status} ${transferStatus}`}>{text}</div>;
}

export interface AddressStatusProps {
  address: string;
  status: TokenTransferStatus;
}

export default function AddressStatus({ address, status }: AddressStatusProps) {
  return (
    <div className={s.addressstatus_container}>
      <Address address={address}></Address>
      <Status status={status}></Status>
    </div>
  );
}
