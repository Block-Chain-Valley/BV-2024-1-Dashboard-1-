import { StatusToast } from '../../Toast/StatusToast';
import Modal from '../index';
import s from './index.module.scss';
import BaseButton from '@/components/atoms/button/BaseButton';
import Amount from '@/components/atoms/dashboard/Amount';
import Asset from '@/components/atoms/dashboard/Asset';
import { getLogo } from '@/components/atoms/dashboard/Asset';
import TextField from '@/components/atoms/inputs/TextField';
import AssetsInfo from '@/components/templates/AssetsInfo';
import useInputValidation from '@/hooks/useInputValidation';
import { getCookie } from '@/libs/cookie';
import { COOKIE_KEY } from '@/libs/types';
import { ERC20_ABI } from '@/libs/utils';
import { getProvider } from '@/libs/utils';
import { getSigner } from '@/libs/utils';
import { ValidateState } from '@/libs/validator';
import ErrorIcon from '@/public/assets/Error.png';
import SuccessIcon from '@/public/assets/Success.png';
import { ModalContext, ToastContext, UserAssetsContext } from '@/store/GlobalContext';
import { WalletContext } from '@/store/GlobalContext';
import { AssetInfo, UserAssets } from '@/store/GlobalContext.d';
import { useCreateAsset } from '@graphql/client';
import { ethers } from 'ethers';
import { useContext, useEffect, useRef, useState } from 'react';

/* 
  [HW 2-1] 자산 추가 기능 개발하기 
  - 아래 AddAssetModal 컴포넌트를 완성하여, 자산 추가 기능을 구현해 주세요.
  - 반드시 모든 기능을 이 파일에 작성하지 않아도 괜찮아요. 필요 시 새로운 컴포넌트를 생성하거나, libs 폴더에 새로운 유틸리티 함수를 추가해도 괜찮아요.
*/

export default function AddAssetModal() {
  const [modal, setModal] = useContext(ModalContext);
  const [, setToast] = useContext(ToastContext);

  const { wallet } = useContext(WalletContext);
  const walletProvider = wallet?.provider;
  const provider = getProvider(walletProvider!);

  const ref = useRef<HTMLInputElement>(null);

  const [isNeedtoCheckAsset, setIsNeedtoCheckAsset] = useState(false);
  const [, setAssetInformation] = useState({
    address: '',
    name: '',
    symbol: '',
    decimal: 0,
    balance: 0,
  });
  const [userAssets, setUserAssets] = useContext(UserAssetsContext);

  type assetStatusT = 'searching' | 'nonExist' | 'exist' | 'alreadyAdded';

  const [assetStatus, setAssetStatus] = useState<assetStatusT>('searching');

  /* 
    아래 코드는 입력값을 검증하는 로직을 포함하는 커스텀 훅이예요. 필요하다면 사용해도 좋아요. 
  */

  const validChecker = (input: string) => {
    if (ethers.utils.isAddress(input)) {
      setIsNeedtoCheckAsset(true);
      return true;
    } else {
      return false;
    }
  };
  //유효한 형식인지 확인, 유효한 컨트랙트를 만드는지 확인

  const { input, isValidInput, inputChangeHandler } = useInputValidation(validChecker);

  useEffect(() => {
    async function checkName() {
      if (isNeedtoCheckAsset) {
        const tokenContract = new ethers.Contract(input, ERC20_ABI, provider);
        try {
          setAssetInformation({
            address: input,
            name: await tokenContract.name(),
            symbol: await tokenContract.symbol(),
            decimal: await tokenContract.decimals(),
            balance: await tokenContract.balanceOf(getCookie(COOKIE_KEY.WALLET_ADDRESS, {})),
          });
          setAssetStatus('exist');
          for (const userAsset of userAssets) {
            if (userAsset.assetInfo.address === input) {
            } else {
            }
          }
        } catch {}
      }
    }
    checkName();
  }, [isNeedtoCheckAsset]);

  function getSubInfo(state: ValidateState) {
    if (input.length > 0) {
      if (state === ValidateState.VALIDATED) {
        switch (assetStatus) {
          case 'searching':
            return <></>;
          case 'nonExist':
            return <></>;
          case 'exist':
            return <></>;
          case 'alreadyAdded':
            return <></>;
        }
      } else if (state === ValidateState.ERROR) {
        return;
      } else {
        return;
      }
    }
  }

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

  /*
   const response = await createAsset({
    variables: {
       input: {
         userWalletAddress: wallet!?.accounts[0].address,
         address: input,
         type: 'TOKEN',
         name: ,
         symbol: ,
         decimal: ,
         balance: wallet!?.accounts[0].balance!.toString(),
       },
     },
   });
   const createAssetInfo = response.data?.createAsset;
   if (!createAssetInfo) throw new Error();
*/

  /* 
    모달이 열렸을 때, Textfield로 포커스를 주는 코드예요. 
  */
  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, [modal]);

  return (
    <Modal>
      <div className={s.add_asset_modal}>
        <div className={s.modal_info}>
          <div className={s.modal_title}>추가할 자산의 주소를 입력하세요.</div>
          <TextField
            placeholder="여기에 자산 주소를 입력하세요."
            ref={ref}
            value={''}
            error={!ethers.utils.isAddress(input) && input.length > 0}
            onChange={(event) => {
              inputChangeHandler(event);
            }}
          />
        </div>
        <div className={s.modal_sub_info}>{getSubInfo(isValidInput)}</div>
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
            disabled={false}
            onClick={() => {
              createAsset;
            }}
          ></BaseButton>
        </div>
      </div>
    </Modal>
  );
}
