import { StatusToast } from '../../Toast/StatusToast';
import Modal from '../index';
import s from './index.module.scss';
import BaseButton from '@/components/atoms/button/BaseButton';
import TextField from '@/components/atoms/inputs/TextField';
import useInputValidation from '@/hooks/useInputValidation';
import { COOKIE_KEY } from '@/libs/types';
import ErrorIcon from '@/public/assets/Error.png';
import SuccessIcon from '@/public/assets/Success.png';
import { ModalContext, ToastContext } from '@/store/GlobalContext';
import { useCreateAsset } from '@graphql/client';
import { useContext, useEffect, useRef } from 'react';
import { useState } from 'react';

/* 
  [HW 2-1] 자산 추가 기능 개발하기 
  - 아래 AddAssetModal 컴포넌트를 완성하여, 자산 추가 기능을 구현해 주세요.
  - 반드시 모든 기능을 이 파일에 작성하지 않아도 괜찮아요. 필요 시 새로운 컴포넌트를 생성하거나, libs 폴더에 새로운 유틸리티 함수를 추가해도 괜찮아요.
*/

export default function AddAssetModal() {
  const [, setModal] = useContext(ModalContext);
  const [, setToast] = useContext(ToastContext);

  const ref = useRef<HTMLInputElement>(null);

  const [address, setAddress] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [existingAssetError, setExistingAssetError] = useState('');

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  const handleAddAsset = async () => {
    setLoading(true);
    try {
      const { data } = await checkAssetExistence({ variables: { address } });
      if (data.assetExists) {
        setExistingAssetError('이미 내 자산 목록에 해당 자산이 존재합니다.');
      } else {
        await createAsset({
          variables: {
            input: {
              address: await data.address(),
              type: 'TOKEN',
              balance: await data.balance(),
              name: await data.name(),
              symbol: '',
              userWalletAddress: COOKIE_KEY.WALLET_ADDRESS,
            },
          },
        });
        setModal(null);
      }
    } catch (error) {
      console.error(error);
      setToast(<StatusToast icon={ErrorIcon} content="다시 시도해 주세요." />);
    }
    setLoading(false);
  };

  /* 
    아래 코드는 입력값을 검증하는 로직을 포함하는 커스텀 훅이예요. 필요하다면 사용해도 좋아요. 
  */
  const { input, isValidInput, inputChangeHandler } = useInputValidation();

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

  return (
    <Modal>
      <div className={s.add_asset_modal}>
        <div className={s.modal_info}>
          <div className={s.modal_title}>추가할 자산의 주소를 입력하세요.</div>
          <TextField
            placeholder="여기에 자산 주소를 입력하세요."
            ref={ref}
            value={''}
            error={false}
            onChange={() => {}}
          />
        </div>
        <div className={s.modal_sub_info}>{/* 코드 추가 */}</div>
        <div className={s.modal_buttons}>
          <BaseButton
            assert={false}
            name="닫기"
            onClick={() => {
              setModal(null);
            }}
          ></BaseButton>
          <BaseButton assert={true} name="추가하기" disabled={false} onClick={() => {}}></BaseButton>
        </div>
      </div>
    </Modal>
  );
}
