import { UIProps } from '../../props';
import s from './index.module.scss';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.locale('ko', {
  relativeTime: {
    future: '%s 후',
    past: '%s 전',
    s: '%d초',
    m: '1분',
    mm: '%d분',
    h: '1시간',
    hh: '%d시간',
    d: '1일',
    dd: '%d일',
    M: '1달',
    MM: '%d달',
    y: '1년',
    yy: '%d년',
  },
});

export interface DateProps extends UIProps.Paragraph {
  timestamp: number;
}

export default function Date(props: DateProps) {
  const { timestamp } = props;

  return <p className={s.date}>{dayjs(timestamp).fromNow()}</p>;
}
