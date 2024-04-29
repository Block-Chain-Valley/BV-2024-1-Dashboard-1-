import { ValidateState } from '@/libs/validator';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';

type ValidInputChecker = (input: string) => boolean;

const baseChecker = (input: string) => {
  // 주소의 길이가 42여야 하며, 0x로 시작해야 합니다.
  return input.length === 42 && input.startsWith('0x') && isHex(input.slice(2));
};

// 16진수인지 확인하는 함수
const isHex = (value: string) => {
  const hexRegex = /^[0-9a-fA-F]+$/;
  return hexRegex.test(value);
};

export default function useInputValidation(checker: ValidInputChecker = baseChecker) {
  const [input, setInput] = useState('');
  const [isValidInput, setIsValidInput] = useState<ValidateState>(ValidateState.NOT_VALIDATED);

  const isInputStarted = useRef(false);

  const inputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const checkIsValidInput = useCallback(
    (input: string) => {
      if (input.length > 0) {
        if (checker(input)) {
          setIsValidInput(ValidateState.VALIDATED);
        } else {
          setIsValidInput(ValidateState.ERROR);
        }
      }
    },
    [checker, input, isValidInput]
  );

  useEffect(() => {
    const keyboardTimer = setTimeout(() => {
      if (!isInputStarted.current) {
        isInputStarted.current = true;
      } else {
        checkIsValidInput(input);
      }
    }, 500);

    return () => {
      clearTimeout(keyboardTimer);
    };
  }, [input, checkIsValidInput]);

  return {
    input,
    isValidInput,
    inputChangeHandler,
  };
}
