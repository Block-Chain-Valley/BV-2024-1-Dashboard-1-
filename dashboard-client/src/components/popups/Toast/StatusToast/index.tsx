import Toast from '..';
import s from './index.module.scss';
import Image, { StaticImageData } from 'next/image';

export interface StatusToastProps {
  icon: StaticImageData;
  content: string;
}
export function StatusToast(props: StatusToastProps) {
  return (
    <Toast>
      <div className={s.toast_contents}>
        <Image src={props.icon} alt="icon" width={15} height={15}></Image>
        <div>{props.content}</div>
      </div>
    </Toast>
  );
}
