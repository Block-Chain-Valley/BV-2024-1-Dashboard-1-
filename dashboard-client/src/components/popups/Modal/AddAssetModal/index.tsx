import { StatusToast } from '../../Toast/StatusToast';
import Modal from '../index';
import s from './index.module.scss';
import BaseButton from '@/components/atoms/button/BaseButton';
import TextField from '@/components/atoms/inputs/TextField';
import SingleAssetInfo, { SingleAssetInfoProps } from '@/components/organs/SingleAssetInfo';
import useInputValidation from '@/hooks/useInputValidation';
import { AddAssetModalStatus } from '@/libs/types';
import { ERC20_ABI, getProvider } from '@/libs/utils';
import ErrorIcon from '@/public/assets/Error.png';
import SuccessIcon from '@/public/assets/Success.png';
import { ModalContext, ToastContext, UserAssetsContext, WalletContext } from '@/store/GlobalContext';
import { useCreateAsset } from '@graphql/client';
import { ethers } from 'ethers';
import { useContext, useEffect, useRef, useState } from 'react';

/* 
  [HW 2-1] 자산 추가 기능 개발하기 
  - 아래 AddAssetModal 컴포넌트를 완성하여, 자산 추가 기능을 구현해 주세요.
  - 반드시 모든 기능을 이 파일에 작성하지 않아도 괜찮아요. 필요 시 새로운 컴포넌트를 생성하거나, libs 폴더에 새로운 유틸리티 함수를 추가해도 괜찮아요.
*/

export default function AddAssetModal() {
  const addAssetStatus = (assetStatus: AddAssetModalStatus) => {
    switch (assetStatus) {
      case AddAssetModalStatus.FETCHING:
        setIsError(false);
        setMsg('입력하신 자산을 네트워크에서 찾고 있어요.');
        return {};
      case AddAssetModalStatus.NOT_FOUND:
        setIsError(true);
        setMsg('자산을 찾을 수 없어요. 입력하신 주소가 맞는지 다시 한 번 확인해 주세요.');
        return {};
      case AddAssetModalStatus.ALREADY_ADDED:
        setIsError(true);
        setMsg('이미 지갑에 추가된 자산이예요.');
        return {};
      case AddAssetModalStatus.AVAILABLE:
        setMsg('입력하신 자산이 맞나요?');
        setIsError(false);
        return {};
      default: //AddAssetModalStatus.DEFAULT
        setIsError(false);
        return {};
    }
  };

  const [, setModal] = useContext(ModalContext);
  const [, setToast] = useContext(ToastContext);
  const [msg, setMsg] = useState('');
  const [assetDetails, setAssetDetails] = useState<SingleAssetInfoProps | null>(null); // 자산 정보
  const [assetStatus, setAssetStatus] = useState(AddAssetModalStatus.DEFAULT);
  const [isError, setIsError] = useState(false);
  const [isEthereum, setIsEthereum] = useState(false);
  const [isCalled, setIsCalled] = useState(false);
  const { wallet } = useContext(WalletContext);
  const [userAssets, setUserAssets] = useContext(UserAssetsContext);

  const ref = useRef<HTMLInputElement>(null);

  /* 
    아래 코드는 입력값을 검증하는 로직을 포함하는 커스텀 훅이예요. 필요하다면 사용해도 좋아요. 
  */
  const { input, isValidInput, inputChangeHandler } = useInputValidation((input: string): boolean => {
    // 주소가 "0x"로 시작하고, 길이가 정확히 42자인지 확인
    if (!input.startsWith('0x') || input.length !== 42) {
      setIsError(true);
      return false;
    }

    // 나머지 40자가 유효한 16진수인지 확인
    const hexPattern = /^[0-9a-fA-F]{40}$/;
    if (hexPattern.test(input.substring(2))) {
      // "0x" 제외한 부분 검증
      setIsError(false);
      setIsEthereum(true);
      return true;
    }
    setIsError(true);
    return false;
  });

  /* 
    아래 코드는 추가하고자 하는 자산의 검증이 완료되었을 시, 서버로 추가하고자 하는 자산 정보를 보내는 코드예요.
    createAsset 함수를 호출하여 자산을 데이터베이스에 추가할 수 있어요. 아래 사용 예시를 참고해주세요.
    각 input 요소에 대한 정보가 더 필요하다면 (최상단 디렉토리) libs/graphql/requests/__generated__/graphql.ts 파일을 참고해 주세요.
  */

  const handleCheckAsset = async (address: string) => {
    console.log('handleCheckAsset');
    if (wallet && !isError) {
      const walletProvider = getProvider(wallet.provider);
      const contract = new ethers.Contract(address, ERC20_ABI, walletProvider);
      console.log(walletProvider, contract);
      try {
        if (contract.name() && contract.symbol() && contract.balanceOf(wallet.accounts[0].address)) {
          const name = await contract.name;
          const symbol = await contract.symbol;
          const balance = await contract.balanceOf(wallet.accounts[0].address);
          console.log(name, symbol, balance);

          setAssetDetails({
            address,
            name,
            symbol,
            balance,
            isEdit: false,
            onSendAsset: () => {},
            onRemoveAsset: () => {},
          });
        }

        const isExist = userAssets.find(({ assetInfo }) => assetInfo.address.toLowerCase() === address.toLowerCase());
        console.log('isExist:', isExist);
        if (isExist) {
          setAssetStatus(AddAssetModalStatus.ALREADY_ADDED);
          setIsError(true);
          addAssetStatus(AddAssetModalStatus.ALREADY_ADDED);
        } else {
          setAssetStatus(AddAssetModalStatus.AVAILABLE);
          addAssetStatus(AddAssetModalStatus.AVAILABLE);
        }
      } catch (e) {
        console.log('error');
        setAssetStatus(AddAssetModalStatus.NOT_FOUND);
        addAssetStatus(AddAssetModalStatus.NOT_FOUND);
        setIsError(true);
      }
    }
  };

  const [createAsset] = useCreateAsset({
    onCompleted: () => {
      setToast(<StatusToast icon={SuccessIcon} content="새로운 자산이 지갑에 추가되었어요." />);
    },
    onError: (error) => {
      console.log(error);
      setToast(<StatusToast icon={ErrorIcon} content="다시 시도해 주세요." />);
    },
  });

  const handleAddAsset = async () => {
    if (assetStatus === AddAssetModalStatus.AVAILABLE) {
      await createAsset({
        variables: {
          input: {
            userWalletAddress: '', // 사용자의 지갑 주소
            address: input, // 자산 주소
            type: 'TOKEN', // 토큰 유형
            name: '', // 자산 이름
            symbol: '', // 자산 심볼
            decimal: 18, // 소수점
            balance: '0', // 초기 잔액
          },
        },
      });

      setModal(null); // 모달 닫기
    }
  };
  // const createAssetInfo = response.data?.createAsset;
  // if (!createAssetInfo) throw new Error();

  /* 
    모달이 열렸을 때, Textfield로 포커스를 주는 코드예요. 
  */

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }

    setAssetDetails(null);

    if (isEthereum && !isError && !isCalled) {
      setIsCalled(true);
      handleCheckAsset(input);
    }
  }, [isEthereum, isError, input]);

  return (
    <Modal>
      <div className={s.add_asset_modal}>
        <div className={s.modal_info}>
          <div className={s.modal_title}>추가할 자산의 주소를 입력하세요.</div>
          <TextField
            placeholder="여기에 자산 주소를 입력하세요."
            ref={ref}
            value={input}
            error={isError}
            onChange={inputChangeHandler}
          />
        </div>
        <div className={s.modal_sub_info}>
          <p className={s.msg}>{msg}</p>
          {assetDetails && <SingleAssetInfo {...assetDetails} />}
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
            disabled={assetStatus !== AddAssetModalStatus.AVAILABLE}
            onClick={handleAddAsset}
          ></BaseButton>
        </div>
      </div>
    </Modal>
  );
}
