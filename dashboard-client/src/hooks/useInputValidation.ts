import { ValidateState } from '@/libs/validator';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';

type ValidInputChecker = (input: string) => boolean;

const baseChecker = (input: string) => {
  return input.length > 0 ? true : false;
};

export default function useInputValidation(checker: ValidInputChecker = baseChecker) {
  const [input, setInput] = useState('');
  const [isValidInput, setIsValidInput] = useState<ValidateState>(ValidateState.DEFAULT);

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
          setIsValidInput(ValidateState.NOT_VALIDATED);
        }
      } else {
        setIsValidInput(ValidateState.DEFAULT);
      }
    },
    [checker]
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
