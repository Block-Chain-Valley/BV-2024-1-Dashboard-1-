import s from './index.module.scss';
import BaseButton from '@/components/atoms/button/BaseButton';
import Modal from '@/components/popups/Modal';
import { ERC20_ABI } from '@/libs/abi';
import { getSigner } from '@/libs/provider';
import { SendProgressState, SendStatusToProgress, SendStatusType } from '@/libs/types';
import { reviseAddress } from '@/libs/utils';
import Arrive_Progress from '@/public/assets/SendAssetIcon/Arrive_Progress.png';
import Arrive_Waiting from '@/public/assets/SendAssetIcon/Arrive_Waiting.png';
import Confirm_Error from '@/public/assets/SendAssetIcon/Confirm_Error.png';
import Confirm_Progress from '@/public/assets/SendAssetIcon/Confirm_Progress.png';
import Send_Error from '@/public/assets/SendAssetIcon/Send_Error.png';
import Send_Progress from '@/public/assets/SendAssetIcon/Send_Progress.png';
import Send_Waiting from '@/public/assets/SendAssetIcon/Send_Waiting.png';
import { ModalContext, UserAssetsContext, WalletContext } from '@/store/GlobalContext';
import { AssetInfo } from '@/store/GlobalContext.d';
import classNames from 'classnames/bind';
import { ethers } from 'ethers';
import Image, { StaticImageData } from 'next/image';
import { useCallback, useContext, useEffect, useState } from 'react';

const cx = classNames.bind(s);

type SendStatusImage = {
  waitingImg?: StaticImageData;
  progressImg: StaticImageData;
  errorImg?: StaticImageData;
  defaultImg: StaticImageData;
};

type SendStatusToImage = {
  [key in SendStatusType]: SendStatusImage;
};

interface SendStatusModalProps {
  targetAddress: string;
  amount: string;
  assetInfo: AssetInfo;
}

const statusImg: SendStatusToImage = {
  [SendStatusType.CONFIRM]: {
    progressImg: Confirm_Progress,
    errorImg: Confirm_Error,
    defaultImg: Confirm_Progress,
  },
  [SendStatusType.SEND]: {
    waitingImg: Send_Waiting,
    progressImg: Send_Progress,
    errorImg: Send_Error,
    defaultImg: Send_Waiting,
  },
  [SendStatusType.ARRIVE]: {
    progressImg: Arrive_Progress,
    waitingImg: Arrive_Waiting,
    defaultImg: Arrive_Waiting,
  },
};

function getStatusImageSrc(stage: SendStatusToProgress, current: SendStatusType) {
  const statusImage = statusImg[current];
  const state = stage[current];
  switch (state) {
    case SendProgressState.WAITING:
      return statusImage.waitingImg || statusImage.defaultImg;
    case SendProgressState.PROGRESS:
      return statusImage.progressImg;
    case SendProgressState.ERROR:
      return statusImage.errorImg || statusImage.defaultImg;
    default:
      return statusImage.defaultImg;
  }
}

function getClassName(state: SendProgressState) {
  switch (state) {
    case SendProgressState.ERROR:
      return 'error';
    case SendProgressState.PROGRESS:
      return 'progress';
    default:
      return '';
  }
}

const initialStage: SendStatusToProgress = {
  [SendStatusType.CONFIRM]: SendProgressState.PROGRESS,
  [SendStatusType.SEND]: SendProgressState.WAITING,
  [SendStatusType.ARRIVE]: SendProgressState.WAITING,
};

function SendStatusModal({ targetAddress, amount, assetInfo }: SendStatusModalProps) {
  const { wallet } = useContext(WalletContext);
  const [, setModal] = useContext(ModalContext);
  const [stage, setStage] = useState<SendStatusToProgress>(initialStage);

  const transferToken = useCallback(async () => {
    if (wallet) {
      setStage(initialStage);
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
        setStage((prevStage) => ({
          ...prevStage,
          [SendStatusType.SEND]: SendProgressState.PROGRESS,
        }));

        try {
          const transferResult = await transferData.wait();
          if (transferResult) {
            setStage((prevStage) => ({
              ...prevStage,
              [SendStatusType.ARRIVE]: SendProgressState.PROGRESS,
            }));
          }
        } catch (e) {
          setStage((prevStage) => ({
            ...prevStage,
            [SendStatusType.SEND]: SendProgressState.ERROR,
          }));
        }
      } catch (e) {
        setStage((prevStage) => ({
          ...prevStage,
          [SendStatusType.CONFIRM]: SendProgressState.ERROR,
        }));
      }
    }
  }, [wallet, assetInfo, amount, targetAddress]);

  useEffect(() => {
    transferToken();
  }, [transferToken]);

  const isError =
    stage[SendStatusType.CONFIRM] === SendProgressState.ERROR || stage[SendStatusType.SEND] === SendProgressState.ERROR;

  return (
    <Modal>
      <div className={s.send_status_modal}>
        <div className={s.modal_info}>
          <p>{reviseAddress(targetAddress)} 주소로</p>
          <p>
            {amount} {assetInfo.symbol}을(를) 전송하는 중이에요.
          </p>
        </div>

        <div className={s.send_status_container}>
          <div className={s.send_status_infos}>
            <Image src={getStatusImageSrc(stage, SendStatusType.CONFIRM)} alt="confirm" width={45} height={45} />
            <Image src={getStatusImageSrc(stage, SendStatusType.SEND)} alt="send" width={133} height={45} />
            <Image src={getStatusImageSrc(stage, SendStatusType.ARRIVE)} alt="arrive" width={133} height={45} />
          </div>
          <div className={s.send_status_infos}>
            <p className={cx('send_status', getClassName(stage[SendStatusType.CONFIRM]))}>송금 요청</p>
            <p className={cx('send_status', getClassName(stage[SendStatusType.SEND]))}>송금 진행 중</p>
            <p className={cx('send_status', getClassName(stage[SendStatusType.ARRIVE]))}>송금 완료</p>
          </div>
        </div>

        <p className={cx('modal_message', isError ? 'error' : '')}>
          {isError ? '송금에 실패했어요. 다시 시도해 주세요.' : '창을 닫아도 송금이 정상적으로 이루어져요.'}
        </p>

        <div className={s.modal_buttons}>
          <BaseButton assert={false} name="닫기" onClick={() => setModal(null)} />
          {isError && <BaseButton assert name="다시 시도하기" onClick={transferToken} />}
        </div>
      </div>
    </Modal>
  );
}

export default SendStatusModal;
