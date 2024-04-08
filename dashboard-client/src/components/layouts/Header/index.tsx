import s from './index.module.scss';
import Tab from '@/components/atoms/navbar/Tab';
import WalletConnectStatus from '@/components/atoms/navbar/WalletConnectStatus';
import { StatusToast } from '@/components/popups/Toast/StatusToast';
import useUpdateUserInfo from '@/hooks/useUpdateUserInfo';
import { getCookie, setCookie } from '@/libs/cookie';
import { TabType } from '@/libs/types';
import { COOKIE_KEY } from '@/libs/types';
import Error from '@/public/assets/Error.png';
import Success from '@/public/assets/Success.png';
import { ToastContext } from '@/store/GlobalContext';
import { WalletContext } from '@/store/GlobalContext';
import { useFetchUser } from '@graphql/client';
import { useEffect } from 'react';
import { useCallback, useContext, useState } from 'react';

/* 
  [HW 1-3] 지갑 연결 기능 개발하기
  - 아래 Header 컴포넌트에 기능을 추가하여, 지갑 연결 기능을 완성해 주세요.
*/

export default function Header() {
  const [, setToast] = useContext(ToastContext);

  const [isFetching, setIsFetching] = useState(false);

  const { wallet, connect, disconnect } = useContext(WalletContext);

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
      console.log(error);
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

  const handleWalletConnection = async () => {
    if (wallet) {
      await disconnect();
      clearUserInfo();
    } else {
      const [newWallet] = await connect();
      if (newWallet && newWallet.accounts.length > 0 && newWallet.chains.length > 0) {
        const { address } = newWallet?.accounts[0];
        const { id: chainId } = newWallet?.chains[0];
        setCookie(COOKIE_KEY.WALLET_ADDRESS, address, new Date(Date.now() + 1000 * 60 * 60 * 24), {});
        setCookie(COOKIE_KEY.CHAIN_ID, chainId, new Date(Date.now() + 1000 * 60 * 60 * 24), {});
        // Fetch user info with the new address
        await handleFetchUser(address);
      }
    }
  };

  useEffect(() => {
    const walletAddress = getCookie(COOKIE_KEY.WALLET_ADDRESS, {});
    const chainId = getCookie(COOKIE_KEY.CHAIN_ID, {});
    if (walletAddress && chainId) {
      handleFetchUser(walletAddress);
    }
  }, [handleFetchUser]);

  return (
    <div className={s.header}>
      <div className={s.navbar}>
        <div className={s.tabs}>
          <Tab tabType={TabType.TOKEN}></Tab>
          <Tab tabType={TabType.NFT}></Tab>
        </div>
        <WalletConnectStatus
          isFetching={isFetching}
          walletAddress={wallet ? wallet.accounts[0].address : ''}
          chainId={wallet ? wallet.chains[0].id : ''}
          onWalletConnect={handleWalletConnection}
        />
      </div>
      <div className={s.divider_container}>
        <div className={s.divider} />
      </div>
    </div>
  );
}
