import s from './index.module.scss';

export interface InputCheckMessageType {
  msg: string;
  isError: boolean;
}

export default function InputCheckMessage({ msg, isError }: InputCheckMessageType) {
  return <div className={`${isError ? s.red : ''} ${s.message}`}>{msg}</div>;
}
