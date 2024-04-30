import IconButton from '@/components/atoms/button/IconButton';
import s from '@/components/atoms/dashboard/Address/index.module.scss';
import { UIProps } from '@/components/atoms/props';
import { StatusToast } from '@/components/popups/Toast/StatusToast';
import { TokenTransferStatus } from '@/libs/types';
import { reviseAddress } from '@/libs/utils';
import CopyHoverIcon from '@/public/assets/CopyHoverIcon.png';
import CopyIcon from '@/public/assets/CopyIcon.png';
import Success from '@/public/assets/Success.png';
import { ToastContext } from '@/store/GlobalContext';
import classNames from 'classnames/bind';
import copy from 'copy-to-clipboard';
import { useContext } from 'react';

export interface AddressProps extends UIProps.Div {
  address: string;
  status: TokenTransferStatus;
}

const cx = classNames.bind(s);
const COPY_MESG = '지갑 주소를 클립보드에 복사했어요.';

const TokenTransferStatusKo: Record<TokenTransferStatus, string> = {
  DEPOSIT: '입금',
  WITHDRAW: '출금',
};

export default function Address(props: AddressProps) {
  const { address, status } = props;
  const [, setToast] = useContext(ToastContext);

  const handleCopy = () => {
    copy(address);
    setToast(<StatusToast icon={Success} content={COPY_MESG} />);
  };

  return (
    <div className={s.address_container}>
      <div className={s.address_box}>
        <p className={s.address}>{reviseAddress(address)}</p>
        <IconButton icon={CopyIcon} hoverIcon={CopyHoverIcon} onClick={handleCopy} />
      </div>
      <div className={cx('status', status.toLocaleLowerCase())}>{TokenTransferStatusKo[status]}</div>
    </div>
  );
}
