import { StatusToast } from '../../Toast/StatusToast';
import Modal from '../index';
import s from './index.module.scss';
import BaseButton from '@/components/atoms/button/BaseButton';
import TextField from '@/components/atoms/inputs/TextField';
import ValidationMessage from '@/components/atoms/inputs/ValidationMessage';
import SingleAssetInfoModal, { SingleAssetInfoModalProps } from '@/components/organs/SingleAssetInfoModal';
import useInputValidation from '@/hooks/useInputValidation';
import { ERC20_ABI, getProvider } from '@/libs/provider';
import { ValidateState } from '@/libs/validator';
import ErrorIcon from '@/public/assets/Error.png';
import SuccessIcon from '@/public/assets/Success.png';
import { ModalContext, ToastContext, UserAssetsContext, WalletContext } from '@/store/GlobalContext';
import { useCreateAsset } from '@graphql/client';
import { ethers } from 'ethers';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';

/* 
  [HW 2-1] 자산 추가 기능 개발하기 
  - 아래 AddAssetModal 컴포넌트를 완성하여, 자산 추가 기능을 구현해 주세요.
  - 반드시 모든 기능을 이 파일에 작성하지 않아도 괜찮아요. 필요 시 새로운 컴포넌트를 생성하거나, libs 폴더에 새로운 유틸리티 함수를 추가해도 괜찮아요.
*/

type Status = 'IDLE' | 'INVALID' | 'PENDING' | 'CAN_ADD' | 'ALREADY_EXIST' | 'NOT_FOUND';
type ResultAsset = SingleAssetInfoModalProps & { decimal: number };

const validation: Record<Status, { msg: string; isError: boolean }> = {
  IDLE: { msg: '', isError: false },
  INVALID: { msg: '', isError: true },
  PENDING: { msg: '입력하신 자산을 네트워크에서 찾고 있어요.', isError: false },
  CAN_ADD: { msg: '입력하신 자산이 맞나요?', isError: false },
  ALREADY_EXIST: { msg: '이미 지갑에 추가된 자산이에요.', isError: true },
  NOT_FOUND: { msg: '자산을 찾을 수 없어요. 입력하신 주소가 맞는지 다시 한 번 확인해 주세요.', isError: true },
};

export default function AddAssetModal() {
  const [, setModal] = useContext(ModalContext);
  const [, setToast] = useContext(ToastContext);
  const { wallet } = useContext(WalletContext);
  const [userAssets, setUserAssets] = useContext(UserAssetsContext);

  const [status, setStatus] = useState<Status>('IDLE');
  const [resultAsset, setResultAsset] = useState<ResultAsset | null>(null);

  const ref = useRef<HTMLInputElement>(null);

  /* 
    아래 코드는 입력값을 검증하는 로직을 포함하는 커스텀 훅이예요. 필요하다면 사용해도 좋아요. 
  */
  const { input, isValidInput, inputChangeHandler } = useInputValidation((input: string) => {
    const regex = /^0x([a-fA-F0-9]{40})$/;
    return regex.test(input);
  });

  /* 
    아래 코드는 추가하고자 하는 자산의 검증이 완료되었을 시, 서버로 추가하고자 하는 자산 정보를 보내는 코드예요.
    createAsset 함수를 호출하여 자산을 데이터베이스에 추가할 수 있어요. 아래 사용 예시를 참고해주세요.
    각 input 요소에 대한 정보가 더 필요하다면 (최상단 디렉토리) libs/graphql/requests/__generated__/graphql.ts 파일을 참고해 주세요.
  */
  const [createAsset] = useCreateAsset({
    onCompleted: () => {
      setToast(<StatusToast icon={SuccessIcon} content="새로운 자산이 지갑에 추가되었어요." />);
    },
    onError: (error) => {
      console.log(error);
      setToast(<StatusToast icon={ErrorIcon} content="다시 시도해 주세요." />);
    },
  });

  const handleSearchAsset = useCallback(
    async (address: string) => {
      if (wallet) {
        const provider = getProvider(wallet.provider);
        const contract = new ethers.Contract(address, ERC20_ABI, provider);

        try {
          const [name, symbol, balance, decimals] = await Promise.all([
            contract.name(),
            contract.symbol(),
            contract.balanceOf(wallet.accounts[0].address),
            contract.decimals(),
          ]);
          const formattedBalance = ethers.utils.formatUnits(balance.toString(), decimals);
          const formattedDecimal = decimals.toNumber();
          setResultAsset({ address, name, symbol, balance: formattedBalance, decimal: formattedDecimal });

          const isAlreadyExist = userAssets.find(
            ({ assetInfo }) => assetInfo.address.toLowerCase() === address.toLowerCase()
          );
          if (isAlreadyExist) {
            setStatus('ALREADY_EXIST');
          } else {
            setStatus('CAN_ADD');
          }
        } catch (e) {
          setStatus('NOT_FOUND');
        }
      }
    },
    [userAssets, wallet]
  );

  const handleCreateAsset = useCallback(async () => {
    if (wallet && resultAsset) {
      try {
        const response = await createAsset({
          variables: {
            input: {
              ...resultAsset,
              userWalletAddress: wallet.accounts[0].address,
              type: 'TOKEN',
            },
          },
        });

        const createAssetInfo = response.data?.createAsset;
        if (createAssetInfo) {
          const { balance, ...assetInfo } = resultAsset;
          setUserAssets([...userAssets, { assetInfo, balance }]);
          setModal(null);
        } else {
          throw new Error();
        }
      } catch (e) {
        console.log(e);
      }
    }
  }, [wallet, resultAsset, createAsset, setModal, setUserAssets, userAssets]);

  useEffect(() => {
    setResultAsset(null);

    if (input.length === 0) {
      setStatus('IDLE');
    } else if (isValidInput === ValidateState.VALIDATED) {
      setStatus('PENDING');
      handleSearchAsset(input);
    } else {
      setStatus('INVALID');
    }
  }, [input, isValidInput, handleSearchAsset]);

  /* 
    모달이 열렸을 때, Textfield로 포커스를 주는 코드예요. 
  */
  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  return (
    <Modal>
      <div className={s.add_asset_modal}>
        <div className={s.modal_info}>
          <div className={s.modal_title}>추가할 자산의 주소를 입력하세요.</div>
          <TextField
            placeholder="여기에 자산 주소를 입력하세요."
            ref={ref}
            value={input}
            error={validation[status].isError}
            onChange={inputChangeHandler}
          />
        </div>
        <div className={s.modal_sub_info}>
          <ValidationMessage {...validation[status]} />
          {resultAsset && <SingleAssetInfoModal {...resultAsset} />}
        </div>
        <div className={s.modal_buttons}>
          <BaseButton
            assert={false}
            name="닫기"
            onClick={() => {
              setModal(null);
            }}
          ></BaseButton>
          <BaseButton
            assert={true}
            name="추가하기"
            disabled={status !== 'CAN_ADD'}
            onClick={handleCreateAsset}
          ></BaseButton>
        </div>
      </div>
    </Modal>
  );
}
