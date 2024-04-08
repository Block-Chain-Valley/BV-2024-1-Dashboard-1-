import s from './index.module.scss';

export default function TransactionTime(props: { tTime: number }) {
  let now = new Date();
  let timePassed = now.getTime() - props.tTime;
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
        <h2 className={s.dateoutput}>{output}</h2>
      </div>
    </div>
  );
}
