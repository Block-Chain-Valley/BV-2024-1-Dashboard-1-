import { UIProps } from '../../props';
import s from './index.module.scss';

export interface DateProps extends UIProps.Div {
  timestamp: number;
}

export default function Date({ timestamp }: DateProps) {
  return (
    <div className={s.date_container}>
      <div className={s.date}>{timestamp}</div>
    </div>
  );
}
