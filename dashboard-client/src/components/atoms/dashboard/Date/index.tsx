import s from './index.module.scss';
import { useEffect, useState } from 'react';

interface DateProps {
  timestamp: number;
}

export default function Date({ timestamp }: DateProps) {
  const [timeDifference, setTimeDifference] = useState<string>('');

  useEffect(() => {
    const transactionDate = new Date(timestamp * 1000);
    const currentDate = new Date();

    const differenceInSeconds = Math.floor((currentDate.getTime() - transactionDate.getTime()) / 1000);

    if (differenceInSeconds < 60) {
      setTimeDifference(`${differenceInSeconds}초 전`);
    } else if (differenceInSeconds < 3600) {
      const minutes = Math.floor(differenceInSeconds / 60);
      setTimeDifference(`${minutes}분 전`);
    } else if (differenceInSeconds < 86400) {
      const hours = Math.floor(differenceInSeconds / 3600);
      setTimeDifference(`${hours}시간 전`);
    } else {
      const days = Math.floor(differenceInSeconds / 86400);
      setTimeDifference(`${days}일 전`);
    }
  }, [timestamp]);

  return <div className={s.date}>{timeDifference}</div>;
}
