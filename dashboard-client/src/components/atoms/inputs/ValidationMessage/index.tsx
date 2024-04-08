import s from './index.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(s);

interface ValidMessageProps {
  msg: string;
  isError: boolean;
}

function ValidationMessage(props: ValidMessageProps) {
  const { msg, isError } = props;

  return <p className={cx('validation_message', isError ? 'error' : '')}>{msg}</p>;
}

export default ValidationMessage;
