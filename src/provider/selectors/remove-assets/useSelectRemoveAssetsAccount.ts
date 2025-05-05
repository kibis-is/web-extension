import { useSelector } from 'react-redux';

// selectors
import { useSelectAccounts } from '@provider/selectors';

// types
import type { IAccount, IMainRootState } from '@provider/types';

export default function useSelectRemoveAssetsAccount(): IAccount | null {
  const accounts: IAccount[] = useSelectAccounts();
  const accountId: string | null = useSelector<IMainRootState, string | null>((state) => state.removeAssets.accountId);

  if (!accountId) {
    return null;
  }

  return accounts.find((value) => value.id === accountId) || null;
}
