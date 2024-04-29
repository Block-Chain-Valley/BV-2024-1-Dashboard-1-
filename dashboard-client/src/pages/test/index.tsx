import AddressContainer from '@/components/atoms/dashboard/Address';
import Address from '@/components/atoms/dashboard/Address';
import Amount from '@/components/atoms/dashboard/Amount';
import Date from '@/components/atoms/dashboard/Date';
import SingleTransactionInfo from '@/components/organs/SingleTransactionInfo';
import Popup from '@/components/popups';
import { TokenTransferStatus } from '@/libs/types';

export default function Test() {
  return (
    <div>
      <Popup />
      <Amount balance={'23.15'} symbol={'dfdfdfggh'} />
      <AddressContainer address={'0xACEdCEC47c7E0E52d5e8dD699FA648F14a2aa61C'} status={'출금'} />
      <Date timestamp={0} />
      <SingleTransactionInfo
        assetAddress={'0x0ada7d5CC1904FCf98765bCD4b80Ea58F6Bc7469'}
        symbol={'eth'}
        name={'ehtereum'}
        targetAddress={'asdfqwer'}
        status={TokenTransferStatus.DEPOSIT}
        amount={'asdfqwer'}
        timestamp={0}
      />
    </div>
  );
}
