import { StatusToast } from '../../Toast/StatusToast';
import Modal from '../index';
import s from './index.module.scss';
import BaseButton from '@/components/atoms/button/BaseButton';
import InputCheckMessage from '@/components/atoms/inputs/InputCheckMessage';
import InputCheckToken from '@/components/atoms/inputs/InputCheckToken';
import TextField from '@/components/atoms/inputs/TextField';
import useInputValidation from '@/hooks/useInputValidation';
import { ERC20_ABI, getProvider } from '@/libs/utils';
import ErrorIcon from '@/public/assets/Error.png';
import SuccessIcon from '@/public/assets/Success.png';
import { ModalContext, ToastContext, UserAssetsContext, WalletContext } from '@/store/GlobalContext';
import { useCreateAsset } from '@graphql/client';
import { EIP1193Provider } from '@web3-onboard/core';
import { BigNumber, Contract, ethers } from 'ethers';
import { Token } from 'graphql';
import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';

/* 
  [HW 2-1] 자산 추가 기능 개발하기 
  - 아래 AddAssetModal 컴포넌트를 완성하여, 자산 추가 기능을 구현해 주세요.
import { ethers } from 'ethers';
  - 반드시 모든 기능을 이 파일에 작성하지 않아도 괜찮아요. 필요 시 새로운 컴포넌트를 생성하거나, libs 폴더에 새로운 유틸리티 함수를 추가해도 괜찮아요.
*/

interface TokenInfoType {
  name: string;
  symbol: string;
  balance: string;
  decimals: number;
}

type Status = 'IDLE' | 'INVALID' | 'PENDING' | 'ADD' | 'ALREADY_EXIST' | 'NOT_FOUND';

const validation: Record<Status, { msg: string; isError: boolean }> = {
  IDLE: { msg: '', isError: false },
  INVALID: { msg: '', isError: true },
  PENDING: { msg: '입력하신 자산을 네트워크에서 찾고 있어요.', isError: false },
  ADD: { msg: '입력하신 자산이 맞나요?', isError: false },
  ALREADY_EXIST: { msg: '이미 지갑에 추가된 자산이에요.', isError: true },
  NOT_FOUND: { msg: '자산을 찾을 수 없어요. 입력하신 주소가 맞는지 다시 한 번 확인해 주세요.', isError: true },
};

export default function AddAssetModal() {
  const [tokenInfo, setTokenInfo] = useState<TokenInfoType | undefined | null>(null);
  const [, setModal] = useContext(ModalContext);
  const [, setToast] = useContext(ToastContext);
  const [status, setStatus] = useState<Status>('IDLE');

  const ref = useRef<HTMLInputElement>(null);

  const { wallet } = useContext(WalletContext);

  const [userAssets, setUserAssets] = useContext(UserAssetsContext);

  /* 
    아래 코드는 입력값을 검증하는 로직을 포함하는 커스텀 훅이예요. 필요하다면 사용해도 좋아요. 
  */
  const { input, isValidInput, inputChangeHandler } =
    useInputValidation(/* 입력값 검증 함수 - () => boolean 타입이어야 해요. */);

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

  // 사용 예시
  // const response = await createAsset({
  //   variables: {
  //     input: {
  //       userWalletAddress: // 값 추가
  //       address: // 값 추가
  //       type: // = 'TOKEN' 으로 고정해서 넣어주세요.
  //       name: // 값 추가
  //       symbol: // 값 추가
  //       decimal: // 값 추가
  //       balance: // 값 추가
  //     },
  //   },
  // });
  // const createAssetInfo = response.data?.createAsset;
  // if (!createAssetInfo) throw new Error();

  /* 
    모달이 열렸을 때, Textfield로 포커스를 주는 코드예요. 
  */
  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  const handleTokenAddress = (e: ChangeEvent<HTMLInputElement>) => {
    inputChangeHandler(e);

    console.log(isValidInput);
  };
  useEffect(() => {
    const fetchData = async () => {
      if (isValidInput === 'VALIDATED') {
        const walletProvider = wallet?.provider;
        if (walletProvider) {
          setStatus('PENDING');
          const Web3Provider = getProvider(walletProvider);

          const contractInstance = new ethers.Contract(input, ERC20_ABI, Web3Provider);
          const token = await fetchToken(contractInstance);
          const reAdd = userAssets.find(({ assetInfo }) => {
            assetInfo.address.toLowerCase === tokenInfo?.name.toLowerCase;
          });
          if (reAdd) {
            setStatus('ALREADY_EXIST');
          } else if (token) {
            setStatus('ADD');
            setTokenInfo(token);
          } else {
            setStatus('NOT_FOUND');
          }
        }
      } else {
        setStatus('INVALID');
      }
    };
    fetchData();
  }, [isValidInput]);

  const fetchToken = async (contract: Contract) => {
    try {
      const [name, symbol, balance, decimals] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.balanceOf(wallet?.accounts[0].address),
        contract.decimals(),
      ]);

      // 여기에서 name, symbol, balance, decimals를 사용하여 작업을 수행합니다.
      // 예: 반환하거나 로그에 출력하거나 다른 작업을 수행합니다.

      return { name, symbol, balance, decimals }; // 값을 반환하거나 원하는 작업을 수행합니다.
    } catch (error) {
      console.error('Error fetching token:', error);
      // 에러 처리 로직을 수행합니다.
    }
  };

  const handleTokenAdd = async () => {
    if (tokenInfo && wallet) {
      try {
        const response = await createAsset({
          variables: {
            input: {
              userWalletAddress: wallet?.accounts[0].address, // 값 추가
              address: input, // 값 추가
              type: 'TOKEN', // = 'TOKEN' 으로 고정해서 넣어주세요.
              name: tokenInfo?.name, // 값 추가
              symbol: tokenInfo?.symbol, // 값 추가
              decimal: tokenInfo?.decimals, // 값 추가
              balance: tokenInfo?.balance, // 값 추가
            },
          },
        });
        const createAssetInfo = response.data?.createAsset;
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Modal>
      <div className={s.add_asset_modal}>
        <div className={s.modal_info}>
          <div className={s.modal_title}>추가할 자산의 주소를 입력하세요.</div>
          <TextField
            placeholder="여기에 자산 주소를 입력하세요."
            ref={ref}
            value={''}
            error={isValidInput === 'ERROR'}
            onChange={handleTokenAddress}
          />
        </div>
        <div className={s.modal_sub_info}>
          <InputCheckMessage {...validation[status]} />
          {tokenInfo && <InputCheckToken {...tokenInfo} />}
        </div>
        <div className={s.modal_buttons}>
          <BaseButton
            assert={false}
            name="닫기"
            onClick={() => {
              setModal(null);
            }}
          ></BaseButton>
          <BaseButton assert={true} name="추가하기" disabled={status !== 'ADD'} onClick={handleTokenAdd}></BaseButton>
        </div>
      </div>
    </Modal>
  );
}
