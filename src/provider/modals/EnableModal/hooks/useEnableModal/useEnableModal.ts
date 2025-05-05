import { ARC0027MethodEnum, type IEnableParams } from '@agoralabs-sh/avm-web-provider';
import { useEffect, useState } from 'react';

// enums
import { EventTypeEnum } from '@provider/enums';

// events
import AVMWebProviderRequestEvent from '@provider/events/AVMWebProviderRequestEvent';

// selectors
import { useSelectAccounts, useSelectEvents, useSelectNetworks, useSelectSystemInfo } from '@provider/selectors';

// types
import type { IAccountWithExtendedProps, INetworkWithTransactionParams } from '@provider/types';
import type { IUseEnableModalState } from './types';

// utils
import availableAccountsForNetwork from '@provider/utils/availableAccountsForNetwork';
import selectDefaultNetwork from '@provider/utils/selectDefaultNetwork';
import sortAccountsByPolisAccount from '@provider/utils/sortAccountsByPolisAccount';

export default function useEnableModal(): IUseEnableModalState {
  // selectors
  const accounts = useSelectAccounts();
  const events = useSelectEvents();
  const networks = useSelectNetworks();
  const systemInfo = useSelectSystemInfo();
  // state
  const [availableAccounts, setAvailableAccounts] = useState<IAccountWithExtendedProps[] | null>(null);
  const [event, setEvent] = useState<AVMWebProviderRequestEvent<IEnableParams> | null>(null);
  const [network, setNetwork] = useState<INetworkWithTransactionParams | null>(null);

  useEffect(() => {
    setEvent(
      (events.find(
        (value) =>
          value.type === EventTypeEnum.AVMWebProviderRequest &&
          value.payload.message.payload.method === ARC0027MethodEnum.Enable
      ) as AVMWebProviderRequestEvent<IEnableParams>) || null
    );
  }, [events]);
  // get the available accounts
  useEffect(() => {
    if (event && network) {
      setAvailableAccounts(
        availableAccountsForNetwork({
          accounts: systemInfo?.polisAccountID
            ? sortAccountsByPolisAccount({
                accounts,
                polisAccountID: systemInfo?.polisAccountID,
              })
            : accounts,
          network,
        })
      );
    }
  }, [accounts, network, event]);
  useEffect(() => {
    if (event && !network) {
      // find the selected network, or use the default one
      setNetwork(
        networks.find((value) => value.genesisHash === event.payload.message.payload.params?.genesisHash) ||
          selectDefaultNetwork(networks)
      );
    }
  }, [event, networks]);

  return {
    availableAccounts,
    event,
    network,
    setAvailableAccounts,
    setNetwork,
  };
}
