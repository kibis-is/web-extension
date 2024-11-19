import { useState } from 'react';

// errors
import { BaseExtensionError } from '@extension/errors';

// managers
import PasskeyAccountManager from '@extension/managers/PasskeyAccountManager';

// selectors
import { useSelectLogger, useSelectSystemInfo } from '@extension/selectors';

// types
import type { IAccountPasskey } from '@extension/types';
import type { IState } from './types';

export default function useAddPasskeyAccount(): IState {
  const _hookName = 'useAddPasskeyAccount';
  // selectors
  const logger = useSelectLogger();
  const systemInfo = useSelectSystemInfo();
  // states
  const [error, setError] = useState<BaseExtensionError | null>(null);
  const [passkey, setPasskey] = useState<IAccountPasskey | null>(null);
  const [requesting, setRequesting] = useState<boolean>(false);
  // actions
  const addPasskeyAction = async (): Promise<boolean> => {
    const _functionName = 'addPasskeyAction';
    let _passkey: IAccountPasskey;

    if (!systemInfo?.deviceID) {
      return false;
    }

    // reset the previous values
    resetAction();

    setRequesting(true);

    logger.debug(`${_hookName}#${_functionName}: requesting passkey details`);

    try {
      // create the passkey
      _passkey = await PasskeyAccountManager.createPasskeyAccount({
        logger,
        deviceID: systemInfo.deviceID,
      });
    } catch (error) {
      logger?.debug(`${_hookName}#${_functionName}:`, error);

      setRequesting(false);
      setError(error);

      return false;
    }

    setPasskey(_passkey);
    setRequesting(false);

    return true;
  };
  const resetAction = () => {
    setError(null);
    setPasskey(null);
    setRequesting(false);
  };

  return {
    addPasskeyAccountAction: addPasskeyAction,
    error,
    passkey,
    requesting,
    resetAction,
  };
}
