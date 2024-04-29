import React, { useContext } from 'react';
import style from './index.module.scss'; // Make sure to create this SCSS module
import IconButton from '../../../components/atoms/button/IconButton';
import copy from 'copy-to-clipboard';
import { StatusToast } from '../../../components/popups/Toast/StatusToast';
import { ToastContext } from '../../../store/GlobalContext';
import Success from '../../../../public/assets/Success.png';
import CopyIcon from '../../../../public/assets/CopyIcon.png'

export default function AddressContainer({ address, status }) {
    const { setToast } = useContext(ToastContext);

    const handleCopyClick = () => {
        copy(address);
        setToast(<StatusToast icon={Success} content="주소가 클립보드에 복사되었습니다." />);
    };

    const formattedAddress = `0x${address.slice(2, 6)}...${address.slice(-4)}`;

    return (
        <div className={style.container}>
            <div className={style.address}>{formattedAddress}</div>
            <IconButton icon={CopyIcon} onClick={handleCopyClick} />
            <div className={style[status]}>{status === 'deposit' ? 'deposit' : 'withdraw'}</div>
        </div>
    );
}
