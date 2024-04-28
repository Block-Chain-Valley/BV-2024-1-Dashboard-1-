import s from './index.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(s);

interface MessageProps {
  content: string;
  isError: boolean;
}

export function Message(props: MessageProps) {
  const { content, isError } = props;

  return <p className={cx('message', isError ? 'error' : '')}>{content}</p>;
}
