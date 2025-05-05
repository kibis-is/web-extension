import { useEffect, useState } from 'react';

// selectors
import { useSelectAccountById, useSelectSettingsSelectedNetwork } from '@provider/selectors';

// repositories
import AccountRepository from '@provider/repositories/AccountRepository';

// types
import { IAccount, IAccountInformation, INetwork } from '@provider/types';

export default function useAccountInformation(id: string): IAccountInformation | null {
  const account: IAccount | null = useSelectAccountById(id);
  const selectedNetwork: INetwork | null = useSelectSettingsSelectedNetwork();
  const [accountInformation, setAccountInformation] = useState<IAccountInformation | null>(null);

  useEffect(() => {
    let selectedAccountInformation: IAccountInformation | null = null;

    if (account && selectedNetwork) {
      selectedAccountInformation = AccountRepository.extractAccountInformationForNetwork(account, selectedNetwork);
    }

    setAccountInformation(selectedAccountInformation);
  }, [account, selectedNetwork]);

  return accountInformation;
}
