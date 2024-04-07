import { getCookie, setCookie } from '../../../libs/cookie';
import s from './index.module.scss';
import Tab from '@/components/atoms/navbar/Tab';
import WalletConnectStatus from '@/components/atoms/navbar/WalletConnectStatus';
import { StatusToast } from '@/components/popups/Toast/StatusToast';
import useUpdateUserInfo from '@/hooks/useUpdateUserInfo';
import { SupportedChainIds, TabType } from '@/libs/types';
import Error from '@/public/assets/Error.png';
import Success from '@/public/assets/Success.png';
import { ToastContext, WalletContext } from '@/store/GlobalContext';
import { useFetchUser } from '@graphql/client';
import { useCallback, useContext, useState } from 'react';

/* 
  [HW 1-3] 지갑 연결 기능 개발하기
  - 아래 Header 컴포넌트에 기능을 추가하여, 지갑 연결 기능을 완성해 주세요.
*/

export default function Header() {
  const [, setToast] = useContext(ToastContext);

  const [isFetching, setIsFetching] = useState(false);

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

  // Shiohn adds

  const { wallet, connect, disconnect } = useContext(WalletContext);

  const handleConnectWallet = useCallback(async () => {
    setIsFetching(true);
    try {
      if (!wallet) {
        const [connectedWallet] = await connect();
        if (connectedWallet && connectedWallet.accounts.length > 0) {
          // cookie
          const currentAddress = connectedWallet.accounts[0].address;
          const currentChainId = connectedWallet.chains[0].id;

          if (currentChainId !== SupportedChainIds.SEPOLIA_TESTNET) {
            setToast(<StatusToast icon={Error} content="앱에서 지원하지 않는 네트워크에요." />);
          } else {
            const storedAddress = getCookie('address', {});
            const storedChainId = getCookie('chainId', {});

            if (currentAddress !== storedAddress || currentChainId !== storedChainId) {
              const expires = new Date();
              expires.setFullYear(expires.getFullYear() + 1); // 1 year from now
              setCookie('address', currentAddress, expires, {});
              setCookie('chainId', currentChainId, expires, {});
            }
            setToast(<StatusToast icon={Success} content="Wallet connected successfully." />);
            await handleFetchUser(currentAddress); // connectedWallet.accounts[0].address
          }
          // cookie
        }
      } else {
        await disconnect({ label: wallet.label });
        setToast(<StatusToast icon={Success} content="Wallet disconnected successfully." />);
        clearUserInfo();
      }
    } catch (error) {
      setToast(<StatusToast icon={Error} content={`Failed to ${wallet ? 'disconnect' : 'connect'} the wallet.`} />);
    } finally {
      setIsFetching(false);
    }
  }, [wallet, connect, disconnect, setToast, handleFetchUser]);

  const walletAddress = wallet?.accounts[0]?.address;
  const chainId = wallet?.chains[0]?.id;

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
          onWalletConnect={handleConnectWallet}
        />
      </div>
      <div className={s.divider_container}>
        <div className={s.divider} />
      </div>
    </div>
  );
}
