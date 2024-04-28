import s from './index.module.scss';
import Notice from '@/components/atoms/dashboard/Notice';
import TransactionsInfoHeader from '@/components/atoms/dashboard/TransactionsInfoHeader';
import SingleTransactionInfo from '@/components/organs/SingleTransactionInfo';
import { NoticeType, TokenTransferStatus } from '@/libs/types';
import { validateWalletNetwork } from '@/libs/validator';
import { UserTransactionsContext, WalletContext } from '@/store/GlobalContext';
import { useContext } from 'react';

/* 
  [HW 1-3] 지갑 연결 기능 개발하기
  - 아래 TransactionsInfo 컴포넌트에 기능을 추가하여,  지갑이 연결되기 전, 지갑이 연결되지 않았음을 안내하는 기능을 추가해 주세요.
*/

export default function TransactionsInfo() {
  const { wallet } = useContext(WalletContext);
  const [userTransactions] = useContext(UserTransactionsContext);
  const isValidNetwork = validateWalletNetwork(wallet?.accounts[0].address, wallet?.chains[0].id);

  return (
    <div className={s.info}>
      <div className={s.title}>거래 기록</div>
      <div className={s.container}>
        <TransactionsInfoHeader></TransactionsInfoHeader>
        <div className={s.transaction_list}>
          {isValidNetwork ? (
            <>
              {/*지갑 정보가 유효하지 않을 시, 안내사항을 표시 */}
              {userTransactions.length === 0 ? (
                <div className={s.notice_container}>
                  <Notice noticeType={NoticeType.NO_TRANSACTION}></Notice>
                </div>
              ) : (
                userTransactions.map((userTransaction) => {
                  return (
                    <SingleTransactionInfo
                      key={userTransaction.transactionHash}
                      assetAddress={userTransaction.assetInfo.address}
                      symbol={userTransaction.assetInfo.symbol}
                      name={userTransaction.assetInfo.name}
                      targetAddress={userTransaction.targetAddress}
                      status={userTransaction.status}
                      amount={userTransaction.transferAmount}
                      timestamp={Number(userTransaction.timestamp)}
                    ></SingleTransactionInfo>
                  );
                })
              )}
            </>
          ) : (
            <div className={s.notice_container}>
              <Notice noticeType={NoticeType.ASSET_WALLET_NOT_CONNECTED} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
