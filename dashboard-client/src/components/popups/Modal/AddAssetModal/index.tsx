import { StatusToast } from '../../Toast/StatusToast';
import Modal from '../index';
import s from './index.module.scss';
import BaseButton from '@/components/atoms/button/BaseButton';
import TextField from '@/components/atoms/inputs/TextField';
import AddAssetInfo from '@/components/organs/AddAssetInfo';
import useInputValidation from '@/hooks/useInputValidation';
import { ERC20_ABI } from '@/libs/abi';
import { getProvider } from '@/libs/provider';
import { AddAssetModalStatus } from '@/libs/types';
import { ValidateState, validateAssetAddress } from '@/libs/validator';
import ErrorIcon from '@/public/assets/Error.png';
import SuccessIcon from '@/public/assets/Success.png';
import { ModalContext, ToastContext, UserAssetsContext, WalletContext } from '@/store/GlobalContext';
import { AssetInfo } from '@/store/GlobalContext.d';
import { useCreateAsset } from '@graphql/client';
import { ethers } from 'ethers';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';

/* 
  [HW 2-1] 자산 추가 기능 개발하기 
  - 아래 AddAssetModal 컴포넌트를 완성하여, 자산 추가 기능을 구현해 주세요.
  - 반드시 모든 기능을 이 파일에 작성하지 않아도 괜찮아요. 필요 시 새로운 컴포넌트를 생성하거나, libs 폴더에 새로운 유틸리티 함수를 추가해도 괜찮아요.
*/
type AssetInfoWithBalance = AssetInfo & { balance: string };

function isTextFieldError(status: AddAssetModalStatus) {
  return status === AddAssetModalStatus.ALREADY_ADDED || status === AddAssetModalStatus.NOT_FOUND;
}

export default function AddAssetModal() {
  const [, setModal] = useContext(ModalContext);
  const [, setToast] = useContext(ToastContext);

  const ref = useRef<HTMLInputElement>(null);
  const { wallet } = useContext(WalletContext);
  const [userAssets, setUserAssets] = useContext(UserAssetsContext);

  const [status, setStatus] = useState<AddAssetModalStatus>(AddAssetModalStatus.DEFAULT);
  const [dataAsset, setDataAsset] = useState<AssetInfoWithBalance | null>(null);

  /* 
    아래 코드는 입력값을 검증하는 로직을 포함하는 커스텀 훅이예요. 필요하다면 사용해도 좋아요. 
  */
  const { input, isValidInput, inputChangeHandler } = useInputValidation((input: string) =>
    validateAssetAddress(input)
  );

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

          setDataAsset({ address, name, symbol, balance: formattedBalance, decimal: formattedDecimal });

          const isAlreadyAdded = userAssets.find(
            ({ assetInfo }) => assetInfo.address.toLowerCase() === address.toLowerCase()
          );

          if (isAlreadyAdded) {
            setStatus(AddAssetModalStatus.ALREADY_ADDED);
          } else {
            setStatus(AddAssetModalStatus.AVAILABLE);
          }
        } catch (error) {
          setStatus(AddAssetModalStatus.NOT_FOUND);
          console.error('Error in searching asset:', error);
        }
      }
    },
    [userAssets, wallet]
  );

  const handleCreateAsset = useCallback(async () => {
    if (wallet && dataAsset) {
      const response = await createAsset({
        variables: {
          input: {
            ...dataAsset,
            userWalletAddress: wallet.accounts[0].address,
            type: 'TOKEN',
          },
        },
      });

      const createAssetInfo = response.data?.createAsset;

      if (createAssetInfo) {
        const { balance, ...assetInfo } = dataAsset;
        setUserAssets([...userAssets, { assetInfo, balance }]);
        setModal(null);
      } else {
        throw new Error();
      }
    }
  }, [wallet, dataAsset, createAsset, setModal, setUserAssets, userAssets]);

  useEffect(() => {
    setDataAsset(null);

    if (input.length === 0) {
      setStatus(AddAssetModalStatus.DEFAULT);
    } else if (isValidInput !== ValidateState.NOT_VALIDATED) {
      setStatus(AddAssetModalStatus.FETCHING);
      handleSearchAsset(input);
    } else {
      setStatus(AddAssetModalStatus.NOT_FOUND);
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
            error={isTextFieldError(status)}
            onChange={inputChangeHandler}
          />
        </div>
        <div className={s.modal_sub_info}>
          <AddAssetInfo assetInfo={dataAsset} status={status} />
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
            disabled={status !== AddAssetModalStatus.AVAILABLE}
            onClick={handleCreateAsset}
          ></BaseButton>
        </div>
      </div>
    </Modal>
  );
}
