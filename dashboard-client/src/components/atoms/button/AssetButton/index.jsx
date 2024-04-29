import React from 'react';
import style from './index.module.scss';

export default function AssetButton({ isEdit, onSend, onDelete }) {
    const buttonText = isEdit ? '삭제' : '보내기';
    const buttonAction = isEdit ? onDelete : onSend;
    const buttonTypeClass = isEdit ? style.deleteButton : style.sendButton;

    return (
        <button
            className={`${style.assetButton} ${buttonTypeClass}`}
            onClick={buttonAction}
        >
            {buttonText}
        </button>
    );
}
