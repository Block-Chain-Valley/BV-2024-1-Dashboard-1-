import { StatusToast } from '../../Toast/StatusToast';
import Modal from '../index';
import s from './index.module.scss';
import Amount from '@/components/atoms/Amount/index';
import BaseButton from '@/components/atoms/button/BaseButton';
import Asset from '@/components/atoms/dashboard/Asset/index';
import TextField from '@/components/atoms/inputs/TextField';
import useInputValidation from '@/hooks/useInputValidation';
import { ValidateState } from '@/libs/validator';
import ErrorIcon from '@/public/assets/Error.png';
import SuccessIcon from '@/public/assets/Success.png';
import { ModalContext, ToastContext } from '@/store/GlobalContext';
import { WalletContext } from '@/store/GlobalContext';
import { useCreateAsset } from '@graphql/client';
import type { WalletState } from '@web3-onboard/core';
import { ethers } from 'ethers';
import { useContext, useEffect, useRef, useState } from 'react';

/* 
  [HW 2-1] 자산 추가 기능 개발하기 
  - 아래 AddAssetModal 컴포넌트를 완성하여, 자산 추가 기능을 구현해 주세요.
  - 반드시 모든 기능을 이 파일에 작성하지 않아도 괜찮아요. 필요 시 새로운 컴포넌트를 생성하거나, libs 폴더에 새로운 유틸리티 함수를 추가해도 괜찮아요.
*/

interface TokenInfo {
  name: string;
  symbol?: string;
  balance?: string;
}

// Sample ERC-20 Token ABI with only 'name' function
const tokenAbi = [
  // The 'name()' function part of the ERC-20 Token standard
  'function name() view returns (string)',
  'function symbol() view returns (string)',
];

async function fetchTokenName(address: string): Promise<TokenInfo | null> {
  // Connect to the Sepolia testnet
  const provider = new ethers.providers.JsonRpcProvider('https://sepolia.drpc.org');

  // Create a contract instance
  const tokenContract = new ethers.Contract(address, tokenAbi, provider);

  try {
    const [tokenName, tokenSymbol] = await Promise.all([tokenContract.name(), tokenContract.symbol()]);

    console.log(`Token name: ${tokenName}, Token symbol: ${tokenSymbol}`);
    return { name: tokenName, symbol: tokenSymbol };
  } catch (error) {
    console.error('Error fetching token name:', error);
    return null;
  }
}

export default function AddAssetModal() {
  const [, setModal] = useContext(ModalContext);
  const [, setToast] = useContext(ToastContext);

  const ref = useRef<HTMLInputElement>(null);

  const [tokenName, setTokenName] = useState(''); // State for token name
  const [isSearching, setIsSearching] = useState(false); // State to handle loading indicator
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [isInWallet, setIsInWallet] = useState(false);

  // 이더리움 주소 형식이 맞는지 확인
  const validateEthereumAddress = (address: string) => ethers.utils.isAddress(address);

  /* 
    아래 코드는 입력값을 검증하는 로직을 포함하는 커스텀 훅이예요. 필요하다면 사용해도 좋아요. 
  */
  const { input, isValidInput, inputChangeHandler } = useInputValidation(validateEthereumAddress);

  const { wallet } = useContext(WalletContext);

  const isInUserWallet = (address: string, walletState: WalletState | null): boolean => {
    if (!walletState) {
      return false; // No wallet connected
    }

    // Check if the main account address matches the given address
    if (walletState.accounts.some((account) => account.address.toLowerCase() === address.toLowerCase())) {
      return true;
    }

    // Check secondary tokens for the given address
    for (const account of walletState.accounts) {
      if (account.secondaryTokens) {
        if (account.secondaryTokens.some((token) => token.name.toLowerCase() === address.toLowerCase())) {
          return true; // Token found in secondary tokens
        }
      }
    }

    return false; // Token not found
  };

  const checkTokenExists = async (address: string) => {
    setIsSearching(true); // Begin search

    const fetchedTokenInfo = await fetchTokenName(address);
    if (fetchedTokenInfo) {
      // Check if the token is already in the user's wallet
      if (!isInUserWallet(address, wallet)) {
        setTokenInfo(fetchedTokenInfo);
        setIsInWallet(false);
      } else {
        setIsInWallet(true);
      }
    } else {
      setTokenInfo(null);
    }
    setIsSearching(false); // End search
  };

  useEffect(() => {
    if (isValidInput === ValidateState.VALIDATED) {
      checkTokenExists(input);
    } else {
      setTokenInfo(null);
      setIsSearching(false);
    }
  }, [input, isValidInput]);

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

  const addButtonClass =
    input !== '' && isValidInput === ValidateState.VALIDATED
      ? s.add_button_enabled // the button should be blue and enabled
      : s.button_disabled; // the button is disabled

  return (
    <Modal>
      <div className={s.add_asset_modal}>
        <div className={s.modal_info}>
          <div className={s.modal_title}>추가할 자산의 주소를 입력하세요.</div>
          <TextField
            placeholder="여기에 자산 주소를 입력하세요."
            ref={ref}
            value={input}
            error={isInWallet || isValidInput === ValidateState.ERROR}
            className={isInWallet ? s.error_input : isValidInput === ValidateState.ERROR ? s.error_input : ''}
            onChange={inputChangeHandler}
          />
        </div>
        <div className={s.single_asset_info_container}>
          {isSearching && <div className={s.modal_sub_info}>입력한 자산을 네트워크에서 찾고 있어요.</div>}
          <div className={s.asset_info_wrapper}>
            {!isInWallet && tokenInfo && <div className={s.modal_sub_info}>입력하신 자산이 맞나요?</div>}
            {isInWallet && tokenInfo && <div className={s.error_text}>이미 추가된 자산이에요.</div>}
            {!tokenInfo && !isSearching && !isInWallet && (
              <div className={s.error_text}>
                자산을 찾을 수 없어요. 입력하신 주소가 맞는지 다시 한 번 확인해 주세요.
              </div>
            )}
            {tokenInfo && (
              <div className={s.asset_amount_container}>
                <Asset address={input} symbol={tokenInfo.symbol ?? 'Unknown'} name={tokenInfo.name} />
                <Amount amount={tokenInfo.balance ?? '0.00'} symbol={tokenInfo.symbol ?? 'Unknown'} />
              </div>
            )}
          </div>
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
            className={addButtonClass}
            disabled={input === '' || isValidInput !== ValidateState.VALIDATED}
            onClick={() => {}}
          ></BaseButton>
        </div>
      </div>
    </Modal>
  );
}
