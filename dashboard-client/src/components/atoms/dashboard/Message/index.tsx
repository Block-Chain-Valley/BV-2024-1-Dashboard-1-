import s from './index.module.scss';
import { AddAssetModalStatus } from '@/libs/types';
import classNames from 'classnames/bind';

const cx = classNames.bind(s);

export interface MessageProps {
  status: AddAssetModalStatus;
}

const messageContent: Record<AddAssetModalStatus, { content: string; isError: boolean }> = {
  DEFAULT: { content: '', isError: false },
  FETCHING: { content: '입력하신 자산을 네트워크에서 찾고 있어요.', isError: false },
  AVAILABLE: { content: '입력하신 자산이 맞나요?', isError: false },
  ALREADY_ADDED: { content: '이미 지갑에 추가된 자산이에요.', isError: true },
  NOT_FOUND: { content: '자산을 찾을 수 없어요. 입력하신 주소가 맞는지 다시 한 번 확인해 주세요.', isError: true },
};

export default function Message(props: MessageProps) {
  const { status } = props;
  const { content, isError } = messageContent[status];

  return <p className={cx('message', isError ? 'error' : '')}>{content}</p>;
}
