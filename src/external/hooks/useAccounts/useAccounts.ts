import { useCallback, useMemo, useState } from 'react';

// managers
import WebAuthnMessageManager from '@external/managers/WebAuthnMessageManager';

// types
import type { IExternalAccount } from '@common/types';
import type { IOptions, IState } from './types';

export default function useAccounts({ logger }: IOptions = {}): IState {
  const _hooksName = 'useAccounts';
  // memos
  const webAuthnMessageManager = useMemo(
    () =>
      new WebAuthnMessageManager({
        logger,
      }),
    []
  );
  // states
  const [accounts, setAccounts] = useState<IExternalAccount[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);
  // actions
  const fetchAccountsAction = useCallback(async () => {
    let _accounts: IExternalAccount[];

    try {
      setFetching(true);

      _accounts = await webAuthnMessageManager.fetchAccounts();

      setAccounts(_accounts);
      setFetching(false);
    } catch (error) {
      logger?.error(`${_hooksName}:`, error);
    }
  }, []);

  return {
    accounts,
    fetchAccountsAction,
    fetching,
  };
}
