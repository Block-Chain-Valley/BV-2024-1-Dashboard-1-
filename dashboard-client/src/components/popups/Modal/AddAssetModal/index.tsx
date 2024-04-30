import { StatusToast } from '../../Toast/StatusToast';
import Modal from '../index';
import s from './index.module.scss';
import BaseButton from '@/components/atoms/button/BaseButton';
import Amount from '@/components/atoms/dashboard/Amount';
import Asset from '@/components/atoms/dashboard/Asset';
import TextField from '@/components/atoms/inputs/TextField';
import useInputValidation from '@/hooks/useInputValidation';
import { ERC20_ABI, getProvider, providerType } from '@/libs/utils';
import { ValidateState } from '@/libs/validator';
import ErrorIcon from '@/public/assets/Error.png';
import SuccessIcon from '@/public/assets/Success.png';
import { ModalContext, ToastContext, UserAssetsContext, WalletContext } from '@/store/GlobalContext';
import { AssetInfo, UserAssets } from '@/store/GlobalContext.d';
import { useCreateAsset } from '@graphql/client';
import { BigNumber, ethers } from 'ethers';
import { validate } from 'graphql';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';

/* 
  [HW 2-1] 자산 추가 기능 개발하기 
  - 아래 AddAssetModal 컴포넌트를 완성하여, 자산 추가 기능을 구현해 주세요.
  - 반드시 모든 기능을 이 파일에 작성하지 않아도 괜찮아요. 필요 시 새로운 컴포넌트를 생성하거나, libs 폴더에 새로운 유틸리티 함수를 추가해도 괜찮아요.
*/

export default function AddAssetModal() {
  const [, setModal] = useContext(ModalContext);
  const [, setToast] = useContext(ToastContext);
  const [tokenName, setTokenName] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenBalance, setTokenBalance] = useState('');
  const [tokenDecimal, setTokenDecimal] = useState<BigNumber>();
  const [isError, setIsError] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [message, setMessage] = useState('');
  const [userAssets, setUserAssets] = useContext(UserAssetsContext);

  const ref = useRef<HTMLInputElement>(null);

  const { wallet } = useContext(WalletContext);

  /* 
    아래 코드는 입력값을 검증하는 로직을 포함하는 커스텀 훅이예요. 필요하다면 사용해도 좋아요. 
  */
  /* 입력값 검증 함수 - () => boolean 타입이어야 해요. */
  const isValidEthereumAddress = (address: string) => {
    // Ethereum 주소 정규식
    const ethereumAddressRegex = /^(0x)?[0-9a-fA-F]{40}$/;
    // 입력된 주소가 Ethereum 주소인지 확인
    return ethereumAddressRegex.test(address);
  };

  const { input, isValidInput, inputChangeHandler } = useInputValidation(isValidEthereumAddress);

  const getAssetInfo = useCallback(async () => {
    setIsValidToken(false);
    try {
      const walletProvider = wallet!.provider;
      const provider = getProvider(walletProvider);
      const tokenContract = new ethers.Contract(input, ERC20_ABI, provider);
      const tokenName = await tokenContract.name();
      setTokenName(tokenName);
      if (userAssets.some((asset) => asset.assetInfo.name === tokenName)) {
        setMessage('이미 지갑에 추가된 자산이에요');
        setIsError(true);
      } else {
        const tokenAddress = input;
        const tokenSymbol = await tokenContract.symbol();
        const tokenBalance = await tokenContract.balanceOf(tokenAddress);
        const tokenDecimal = await tokenContract.decimals();
        setTokenAddress(tokenAddress);
        setTokenSymbol(tokenSymbol);
        setTokenBalance(tokenBalance);
        setTokenDecimal(tokenDecimal);
        setMessage('입력하신 자산이 맞나요?');
        console.log(tokenBalance);
        console.log(tokenDecimal);
        console.log(typeof tokenBalance);
        console.log(typeof tokenDecimal);
        setIsValidToken(true);
      }
    } catch (error) {
      setIsError(true);
      setMessage('자산을 찾을 수 없어요. 입력하신 주소가 맞는지 다시 한 번 확인해 주세요.');
    }
  }, [input, userAssets, wallet]);

  useEffect(() => {
    if (isValidInput === ValidateState.NOT_VALIDATED) {
      setMessage('');
    } else if (isValidInput === ValidateState.VALIDATED) {
      getAssetInfo();
    }
  }, [input, isValidInput, getAssetInfo]);

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

  const handleClick = async () => {
    const response = await createAsset({
      variables: {
        input: {
          userWalletAddress: wallet!.accounts[0].address,
          address: tokenAddress,
          type: 'TOKEN',
          name: tokenName,
          symbol: tokenSymbol,
          decimal: tokenDecimal!.toNumber(),
          balance: tokenBalance!,
        },
      },
    });
    const createAssetInfo = response.data?.createAsset;
    if (!createAssetInfo) {
      console.log(response);
      console.log(createAssetInfo);
      throw new Error();
    }
  };

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
  /*
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
            error={isValidInput === ValidateState.ERROR || isError}
            onChange={inputChangeHandler}
          />
        </div>
        <div className={s.modal_sub_info}>{message}</div>
        {isValidToken ? (
          <div className={s.singleasset_container}>
            <Asset address={tokenAddress} symbol={tokenSymbol} name={tokenName}></Asset>
            <div className={s.singleasset_right}>
              <Amount balance={tokenBalance} symbol={tokenSymbol}></Amount>
            </div>
          </div>
        ) : null}
        <div className={s.modal_buttons}>
          <BaseButton
            assert={false}
            name="닫기"
            onClick={() => {
              setModal(null);
            }}
          ></BaseButton>
          <BaseButton
            assert={isValidInput === ValidateState.VALIDATED}
            name="추가하기"
            disabled={isValidInput !== ValidateState.VALIDATED || isError}
            onClick={handleClick}
          ></BaseButton>
        </div>
      </div>
    </Modal>
  );
}
