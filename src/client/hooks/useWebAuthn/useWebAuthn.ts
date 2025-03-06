import { useCallback, useMemo, useState } from 'react';

// errors
import { BaseExtensionError } from '@common/errors';

// managers
import WebAuthnMessageManager from '@client/managers/WebAuthnMessageManager';

// types
import type {
  IOptions as IWebAuthnMessageManagerOptions,
  IResult as IWebAuthnMessageManagerResult,
} from '@client/managers/WebAuthnMessageManager';
import type { IOptions, IState } from './types';

export default function useWebAuthn({
  logger,
  webAuthnMessageManager,
}: IOptions = {}): IState {
  const _hook = 'useWebAuthn';
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
  const [result, setResult] = useState<IWebAuthnMessageManagerResult | null>(
    null
  );
  // actions
  const authenticateAction = useCallback(
    async (
      options: IWebAuthnMessageManagerOptions<PublicKeyCredentialRequestOptions>
    ) => {
      let _result: IWebAuthnMessageManagerResult | null;

      setResult(null);
      setError(null);

      try {
        _result = await _webAuthnMessageManager.authenticate(options);

        setResult(_result);
      } catch (error) {
        logger?.error(`${_hook}:`, error);

        setError(error);
      }
    },
    []
  );
  const registerAction = useCallback(
    async (
      options: IWebAuthnMessageManagerOptions<PublicKeyCredentialCreationOptions>
    ) => {
      let _result: IWebAuthnMessageManagerResult | null;

      setResult(null);
      setError(null);

      try {
        _result = await _webAuthnMessageManager.register(options);

        setResult(_result);
      } catch (error) {
        logger?.error(`${_hook}:`, error);

        setError(error);
      }
    },
    []
  );

  return {
    authenticateAction,
    error,
    registerAction,
    result,
  };
}
