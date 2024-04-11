import s from './index.module.scss';
import moment from 'moment';

export interface DateProps {
  timestamp: number;
}

export default function Datetime({ timestamp }: DateProps) {
  const currenttime = moment();
  const transactiontime = moment(timestamp);

  const time = Math.ceil(currenttime.diff(transactiontime) / 1000); //- timestamp

  let show = '';

  if (time < 60) {
    show = `${time}초`;
  } else if (time < 3600) {
    show = `${Math.ceil(time / 60)}분`;
  } else if (time < 86400) {
    show = `${Math.ceil(time / 3600)}시간`;
  } else {
    show = `${Math.ceil(time / 86400)}일`;
  }

  return (
    <div className={s.date_container}>
      <div className={s.date}>{show + ' 전'}</div>
    </div>
  );
}
