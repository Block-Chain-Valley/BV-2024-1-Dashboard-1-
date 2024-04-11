import AddressContainer from '@/components/atoms/dashboard/Address';
import Address from '@/components/atoms/dashboard/Address';
import Amount from '@/components/atoms/dashboard/Amount';
import Date from '@/components/atoms/dashboard/Date';
import Popup from '@/components/popups';

export default function Test() {
  return (
    <div>
      <Popup />
      <Amount balance={'23.15'} symbol={'dfdfdfggh'} />
      <AddressContainer address={'0xACEdCEC47c7E0E52d5e8dD699FA648F14a2aa61C'} status={'출금'} />
      <Date timestamp={0} />
    </div>
  );
}
