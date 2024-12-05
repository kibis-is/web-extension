import { useCallback, useMemo, useState } from 'react';

// errors
import { BaseExtensionError } from '@common/errors';

// managers
import WebAuthnMessageManager from '@client/managers/WebAuthnMessageManager';

// types
import type {
  IRegisterOptions,
  IRegisterResult,
} from '@client/managers/WebAuthnMessageManager';
import type { IOptions, IState } from './types';

export default function useWebAuthnRegister({
  logger,
  webAuthnMessageManager,
}: IOptions = {}): IState {
  const _hooksName = 'useWebAuthnRegister';
  // memos
  const _webAuthnMessageManager = useMemo(
    () =>
      webAuthnMessageManager ||
      new WebAuthnMessageManager({
        logger,
      }),
    [webAuthnMessageManager]
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
      _result = await _webAuthnMessageManager.register(options);

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
