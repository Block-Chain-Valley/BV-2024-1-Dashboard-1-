import s from './index.module.scss';
import Tab from '@/components/atoms/navbar/Tab';
import WalletConnectStatus from '@/components/atoms/navbar/WalletConnectStatus';
import { StatusToast } from '@/components/popups/Toast/StatusToast';
import useUpdateUserInfo from '@/hooks/useUpdateUserInfo';
import { getCookie, removeCookie, setCookie } from '@/libs/cookie';
import { TabType } from '@/libs/types';
import { COOKIE_KEY } from '@/libs/types';
import { validateWalletNetwork } from '@/libs/validator';
import Error from '@/public/assets/Error.png';
import Success from '@/public/assets/Success.png';
import { ToastContext } from '@/store/GlobalContext';
import { WalletContext } from '@/store/GlobalContext';
import { useFetchUser } from '@graphql/client';
import { WalletState } from '@web3-onboard/core';
import { useCallback, useContext, useEffect, useState } from 'react';

/* 
  [HW 1-3] 지갑 연결 기능 개발하기
  - 아래 Header 컴포넌트에 기능을 추가하여, 지갑 연결 기능을 완성해 주세요.
*/

export default function Header() {
  const [, setToast] = useContext(ToastContext);
  const [isFetching, setIsFetching] = useState(false);
  const { wallet, connect, disconnect } = useContext(WalletContext);

  const walletAddress = wallet?.accounts[0].address;
  const chainId = wallet?.chains[0].id;

  /* 
    아래 함수는 서버로부터 가져온 사용자의 자산 정보를 전역 상태(Global state)에 저장하거나, 초기화하는 함수입니다. 
    구현 시 상황에 맞게 사용해 주세요.
  */
  const { updateUserInfo, clearUserInfo } = useUpdateUserInfo();

  /* 
    아래 코드는 추가하고자 하는 자산의 검증이 완료되었을 시, 서버로 추가하고자 하는 자산 정보를 보내는 코드예요.
    fetchUser 함수를 호출하여 사용자의 자산 및 트랜잭션 현황 정보를 업데이트하고 최신 정보를 내려받을 수 있어요. 
    handleFetchUser 함수 내부에서만 호출되는 함수로, 과제 구현 시에는 handleFetchUser 함수를 사용해 주세요.
  */
  const [fetchUser] = useFetchUser({
    onCompleted: () => {
      setToast(<StatusToast icon={Success} content="지갑의 자산 정보를 가져왔어요." />);
    },
    onError: (error) => {
      setToast(<StatusToast icon={Error} content="지갑의 자산 정보를 가져오지 못했어요." />);
    },
  });

  /*
    아래 함수는 지갑이 연결되었을 시, 사용자의 자산 및 트랜잭션 정보를 업데이트하며, 업데이트 상태를 관리합니다.
  */
  const handleFetchUser = useCallback(
    async (address: string) => {
      setIsFetching(true);
      const response = await fetchUser({ variables: { input: { address } } });
      const userInfo = response.data?.fetchUser;
      updateUserInfo(userInfo!);
      setIsFetching(false);
    },
    [fetchUser, updateUserInfo]
  );

  const connectWallet = useCallback(
    async (wallet: WalletState | null) => {
      const address = wallet?.accounts[0].address;
      const label = wallet?.label;

      if (address) {
        //이미 연결O : 지갑 연결을 해제하고 쿠키 정보를 삭제
        await disconnect({ label });
      } else {
        //연결X
        await connect();
      }
    },
    [wallet, connect, disconnect]
  );

  //쿠키 정보를 업데이트하고 사용자의 자산 및 트랜잭션 정보를 최신화
  const updateWallet = useCallback(
    (wallet: WalletState | null) => {
      if (wallet) {
        const loadedAddress = wallet.accounts[0]?.address;
        const loadedChainId = wallet.chains[0]?.id;
        const isValidNetwork = validateWalletNetwork(loadedAddress, loadedChainId);

        if (isValidNetwork) {
          handleFetchUser(loadedAddress);
          setCookie(COOKIE_KEY.WALLET_ADDRESS, loadedAddress, new Date(Date.now() + 1000 * 60 * 60 * 24), {});
          setCookie(COOKIE_KEY.CHAIN_ID, loadedChainId, new Date(Date.now() + 1000 * 60 * 60 * 24), {});
          setToast(<StatusToast icon={Success} content="지갑 연결 성공" />);
          handleFetchUser(loadedAddress);
        }
      }
    },
    [wallet, handleFetchUser, setCookie, setToast]
  );

  //지갑 연결을 해제하고 쿠키 정보를 삭제
  const disconnectWallet = useCallback(() => {
    removeCookie(COOKIE_KEY.WALLET_ADDRESS, {}); // 쿠키 정보 삭제
    removeCookie(COOKIE_KEY.CHAIN_ID, {});
    clearUserInfo();
  }, [removeCookie, clearUserInfo]);

  useEffect(() => {
    //지갑 상태에 저장된 지갑 주소 및 chainId와 다를 시, wallet 정보 최신화
    if (wallet) {
      console.log('connetWallet :', wallet);
      const loadedAddress = getCookie(COOKIE_KEY.WALLET_ADDRESS, {});
      const loadedChainId = getCookie(COOKIE_KEY.CHAIN_ID, {});
      const currentAddress = wallet.accounts[0].address;
      const currentChainId = wallet.chains[0].id;
      if (loadedAddress !== currentAddress || loadedChainId !== currentChainId) {
        updateWallet(wallet);
      }
    } else {
      disconnectWallet();
    }
  }, [wallet, getCookie, updateWallet, connectWallet]);

  return (
    <div className={s.header}>
      <div className={s.navbar}>
        <div className={s.tabs}>
          <Tab tabType={TabType.TOKEN}></Tab>
          <Tab tabType={TabType.NFT}></Tab>
        </div>
        <WalletConnectStatus
          isFetching={isFetching}
          walletAddress={walletAddress}
          chainId={chainId} // Sepolia Testnet의 id입니다.
          onWalletConnect={() => connectWallet(wallet)}
        />
      </div>
      <div className={s.divider_container}>
        <div className={s.divider} />
      </div>
    </div>
  );
}
