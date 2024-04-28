import s from './index.module.scss';

export interface DateProps {
  transactionTime: Date;
}

export default function DateDiff(props: DateProps) {
  const currentTime = new Date();
  const transactionTime = props.transactionTime;
  const timeDiff = Math.floor((currentTime.getTime() - transactionTime.getTime()) / 1000);

  let dateDiff: string;
  if (timeDiff < 60) {
    dateDiff = `${timeDiff}초 전`;
  } else if (timeDiff < 3600) {
    const minutes = Math.floor(timeDiff / 60);
    dateDiff = `${minutes}분 전`;
  } else if (timeDiff < 86400) {
    const hours = Math.floor(timeDiff / 3600);
    dateDiff = `${hours}시간 전`;
  } else {
    const days = Math.floor(timeDiff / 86400);
    dateDiff = `${days}일 전`;
  }

  return (
    <div className={s.container}>
      <p className={s.date}>{dateDiff}</p>
    </div>
  );
}
