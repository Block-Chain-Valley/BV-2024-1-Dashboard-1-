import s from './index.module.scss';
import { ModalContext } from '@/store/GlobalContext';
import { PropsWithChildren, useContext } from 'react';

type Props = PropsWithChildren<{ closeable?: boolean; onClose?: () => void }>;

export default function Modal({ children, closeable = true, onClose }: Props) {
  const [, setModal] = useContext(ModalContext);

  return (
    <>
      <div className={s.modal_content} tabIndex={0}>
        {children}
      </div>
      <div
        className={s.modal_backdrop}
        onClick={() => {
          if (!closeable) return;
          onClose?.() || setModal(null);
        }}
      />
    </>
  );
}
