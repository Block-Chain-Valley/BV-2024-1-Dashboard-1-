import style from './index.module.scss';

export default function Amount ({ amount, symbol }) {
    const formatSymbol = (symbol) => symbol.length > 7 ? `${symbol.substring(0, 5)}...` : symbol;

    const formatAmount = (amount) => {
        let formattedAmount = parseFloat(amount).toLocaleString(undefined, {
            maximumFractionDigits: 4,
            useGrouping: false
        });
        formattedAmount = formattedAmount.replace(/(\.\d*?[1-9])0+$/, "$1");
        formattedAmount = formattedAmount.replace(/\.$/, "");
        return formattedAmount;
    };

    const renderAmount = (amount) => {
        const absAmount = Math.abs(amount);
        if (absAmount > 9999999) {
            return <span className={style.large}> {formatAmount(amount)}</span>;
        } else if (absAmount < 0.0001) {
            return <span className={style.large}> {formatAmount(amount)}</span>;
        }
        return <span>{formatAmount(amount)}</span>;
    };

    return (
      <div className={style.amountContainer}>
          {renderAmount(amount)} <span className={style.small}>{formatSymbol(symbol)}</span>
      </div>
    );
}