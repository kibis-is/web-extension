import { useCallback, useState } from 'react';

// types
import type { IExternalAccount } from '@external/types';
import type { IState } from './types';

export default function useAccounts(): IState {
  // states
  const [accounts, setAccounts] = useState<IExternalAccount[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);
  // actions
  const fetchAccountsAction = useCallback(async () => {}, []);

  return {
    accounts,
    fetchAccountsAction,
    fetching,
  };
}
