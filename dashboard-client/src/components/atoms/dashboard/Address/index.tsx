import s from './index.module.scss';
import CopyIcon from '@/public/assets/CopyIcon.png';
import Image from 'next/image';

export interface AddressProps {
  address: string;
}

export default function Address({ address }: AddressProps) {
  return (
    <div className={s.address_container}>
      <div>{address}</div>
      <div className={s.copy_icon}>
        <Image src={CopyIcon} alt="CopyIcon" />
      </div>
    </div>
  );
}
