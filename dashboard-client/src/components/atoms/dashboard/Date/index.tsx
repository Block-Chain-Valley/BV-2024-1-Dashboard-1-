import s from './index.module.scss';

export default function TransactionTime(tTime: Date) {
  let now = new Date();
  let timePassed = now.getTime() - tTime.getTime();
  let output;

  if (timePassed < 60000) {
    output = `${timePassed / 1000}초 전`;
  } else if (timePassed < 3600000) {
    output = `${timePassed / 60000}분 전`;
  } else if (timePassed < 24 * 60 * 60 * 1000) {
    output = `${timePassed / 3600000}시간 전`;
  } else {
    output = `${(timePassed / 24) * 60 * 60 * 1000}일 전`;
  }

  return (
    <div className={s.datecontainer}>
      <div className={s.date}>
        <h2>{output}</h2>
      </div>
    </div>
  );
}
