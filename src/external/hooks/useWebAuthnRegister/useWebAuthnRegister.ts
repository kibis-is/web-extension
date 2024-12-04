import { useCallback, useMemo, useState } from 'react';

// errors
import { BaseExtensionError } from '@common/errors';

// managers
import WebAuthnMessageManager from '@external/managers/WebAuthnMessageManager';

// types
import type {
  IRegisterOptions,
  IRegisterResult,
} from '@external/managers/WebAuthnMessageManager';
import type { IOptions, IState } from './types';

export default function useWebAuthnRegister({ logger }: IOptions = {}): IState {
  const _hooksName = 'useWebAuthnRegister';
  // memos
  const webAuthnMessageManager = useMemo(
    () =>
      new WebAuthnMessageManager({
        logger,
      }),
    []
  );
  // states
  const [error, setError] = useState<BaseExtensionError | null>(null);
  const [result, setResult] = useState<IRegisterResult | null>(null);
  // actions
  const registerAction = useCallback(async (options: IRegisterOptions) => {
    let _result: IRegisterResult | null;

    setResult(null);
    setError(null);

    try {
      _result = await webAuthnMessageManager.register(options);

      setResult(_result);
    } catch (error) {
      logger?.error(`${_hooksName}:`, error);

      setError(error);
    }
  }, []);

  return {
    error,
    registerAction,
    result,
  };
}
