import Modal from '../..';
import s from './index.module.scss';
import BaseButton from '@/components/atoms/button/BaseButton';
import { ERC20_ABI, getSigner } from '@/libs/provider';
import { reviseAddress } from '@/libs/utils';
import ArriveProgress from '@/public/assets/SendAssetIcon/Arrive_Progress.png';
import ArriveWaiting from '@/public/assets/SendAssetIcon/Arrive_Waiting.png';
import ConfirmError from '@/public/assets/SendAssetIcon/Confirm_Error.png';
import ConfirmProgress from '@/public/assets/SendAssetIcon/Confirm_Progress.png';
import SendError from '@/public/assets/SendAssetIcon/Send_Error.png';
import SendProgress from '@/public/assets/SendAssetIcon/Send_Progress.png';
import SendWaiting from '@/public/assets/SendAssetIcon/Send_Waiting.png';
import { ModalContext, WalletContext } from '@/store/GlobalContext';
import { AssetInfo } from '@/store/GlobalContext.d';
import classNames from 'classnames/bind';
import { ethers } from 'ethers';
import Image, { StaticImageData } from 'next/image';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

const cx = classNames.bind(s);

type Status = 'CONFIRM_PROGRESS' | 'CONFIRM_ERROR' | 'SEND_PROGRESS' | 'SEND_ERROR' | 'ARRIVE_PROGRESS';

interface StatusInfoItem {
  cn: 'progress' | 'error' | '';
  img: StaticImageData;
  current?: boolean;
}
interface StatusInfo {
  confirm: StatusInfoItem;
  send: StatusInfoItem;
  arrive: StatusInfoItem;
}

interface SendStatusModalProps {
  targetAddress: string;
  amount: string;
  assetInfo: AssetInfo;
}

function SendStatusModal(props: SendStatusModalProps) {
  const { targetAddress, amount, assetInfo } = props;

  const { wallet } = useContext(WalletContext);
  const [, setModal] = useContext(ModalContext);

  const [status, setStatus] = useState<Status>('CONFIRM_PROGRESS');

  const statusInfo: StatusInfo = useMemo(() => {
    switch (status) {
      case 'CONFIRM_ERROR':
        return {
          confirm: { cn: 'error', img: ConfirmError },
          send: { cn: '', img: SendWaiting },
          arrive: { cn: '', img: ArriveWaiting },
        };
      case 'SEND_PROGRESS':
        return {
          confirm: { cn: 'progress', img: ConfirmProgress },
          send: { cn: 'progress', img: SendProgress, current: true },
          arrive: { cn: '', img: ArriveWaiting },
        };
      case 'SEND_ERROR':
        return {
          confirm: { cn: 'progress', img: ConfirmProgress },
          send: { cn: 'error', img: SendError },
          arrive: { cn: '', img: ArriveWaiting },
        };
      case 'ARRIVE_PROGRESS':
        return {
          confirm: { cn: 'progress', img: ConfirmProgress },
          send: { cn: 'progress', img: SendProgress },
          arrive: { cn: 'progress', img: ArriveProgress },
        };
      case 'CONFIRM_PROGRESS':
      default:
        return {
          confirm: { cn: 'progress', img: ConfirmProgress, current: true },
          send: { cn: '', img: SendWaiting },
          arrive: { cn: '', img: ArriveWaiting },
        };
    }
  }, [status]);

  const transferToken = useCallback(async () => {
    if (wallet) {
      setStatus('CONFIRM_PROGRESS');
      const signer = getSigner(wallet.provider);
      const contract = new ethers.Contract(assetInfo.address, ERC20_ABI, signer);

      try {
        const transferData =
          assetInfo.address === ethers.constants.AddressZero
            ? await signer.sendTransaction({
                to: targetAddress,
                value: ethers.utils.parseEther(amount),
              })
            : await contract.transfer(targetAddress, ethers.utils.parseUnits(amount, assetInfo.decimal));
        setStatus('SEND_PROGRESS');

        try {
          const transferResult = await transferData.wait();
          if (transferResult) {
            setStatus('ARRIVE_PROGRESS');
            // TODO:: token, tnx 정보 업데이트
          }
        } catch (e) {
          setStatus('SEND_ERROR');
        }
      } catch (e) {
        setStatus('CONFIRM_ERROR');
      }
    }
  }, [wallet, assetInfo, amount, targetAddress]);

  useEffect(() => {
    transferToken();
  }, [transferToken]);

  const isError = status === 'CONFIRM_ERROR' || status === 'SEND_ERROR';

  return (
    <Modal>
      <div className={s.send_status_modal}>
        <div className={s.send_info}>
          <p>{reviseAddress(targetAddress)} 주소로</p>
          <p>
            {amount} {assetInfo.symbol}을(를) 전송하는 중이에요.
          </p>
        </div>

        <div className={s.send_status_wrap}>
          <div className={s.send_status_img}>
            <Image
              className={statusInfo.confirm.current ? s.current : ''}
              src={statusInfo.confirm.img}
              alt="confirm"
              width={45}
              height={45}
            />
            <Image
              className={statusInfo.send.current ? s.current : ''}
              src={statusInfo.send.img}
              alt="send"
              width={133}
              height={45}
            />
            <Image src={statusInfo.arrive.img} alt="arrive" width={133} height={45} />
          </div>
          <div className={s.send_status_text}>
            <p className={s[statusInfo.confirm.cn]}>송금 요청</p>
            <p className={s[statusInfo.send.cn]}>송금 진행 중</p>
            <p className={s[statusInfo.arrive.cn]}>송금 완료</p>
          </div>
        </div>

        <p className={cx('send_desc', isError ? 'error' : '')}>
          {isError ? '송금에 실패했어요. 다시 시도해 주세요.' : '창을 닫아도 송금이 정상적으로 이루어져요.'}
        </p>

        <div className={s.button_wrap}>
          <BaseButton assert={false} name="닫기" onClick={() => setModal(null)} />
          {isError && <BaseButton assert name="다시 시도하기" onClick={transferToken} />}
        </div>
      </div>
    </Modal>
  );
}

export default SendStatusModal;
