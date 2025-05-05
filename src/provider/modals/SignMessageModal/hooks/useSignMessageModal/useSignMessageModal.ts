import { ARC0027MethodEnum, ISignMessageParams } from '@agoralabs-sh/avm-web-provider';
import { useEffect, useState } from 'react';

// enums
import { EventTypeEnum } from '@provider/enums';

// events
import AVMWebProviderRequestEvent from '@provider/events/AVMWebProviderRequestEvent';

// selectors
import { useSelectAccounts, useSelectEvents, useSelectSessions } from '@provider/selectors';

// types
import type { IAccountWithExtendedProps } from '@provider/types';
import type { IUseSignMessageModalState } from './types';

// utils
import authorizedAccountsForHost from '@provider/utils/authorizedAccountsForHost';
import convertPublicKeyToAVMAddress from '@common/utils/convertPublicKeyToAVMAddress';

export default function useSignMessageModal(): IUseSignMessageModalState {
  // selectors
  const accounts = useSelectAccounts();
  const events = useSelectEvents();
  const sessions = useSelectSessions();
  // state
  const [authorizedAccounts, setAuthorizedAccounts] = useState<IAccountWithExtendedProps[] | null>(null);
  const [event, setEvent] = useState<AVMWebProviderRequestEvent<ISignMessageParams> | null>(null);
  const [signer, setSigner] = useState<IAccountWithExtendedProps | null>(null);

  useEffect(() => {
    setEvent(
      (events.find(
        (value) =>
          value.type === EventTypeEnum.AVMWebProviderRequest &&
          value.payload.message.payload.method === ARC0027MethodEnum.SignMessage
      ) as AVMWebProviderRequestEvent<ISignMessageParams>) || null
    );
  }, [events]);
  // when we have accounts, sessions and the event, update the authorized accounts
  useEffect(() => {
    if (event && accounts.length > 0 && !authorizedAccounts) {
      setAuthorizedAccounts(
        authorizedAccountsForHost({
          accounts,
          host: event.payload.message.payload.clientInfo.host,
          sessions,
        })
      );
    }
  }, [accounts, event, sessions]);
  // if we have the event and the authorized accounts update the signer
  useEffect(() => {
    if (event && authorizedAccounts && !signer) {
      setSigner(
        authorizedAccounts.find(
          (value) => convertPublicKeyToAVMAddress(value.publicKey) === event.payload.message.payload.params?.signer
        ) ||
          authorizedAccounts[0] ||
          null
      );
    }
  }, [authorizedAccounts, event]);

  return {
    authorizedAccounts,
    event,
    signer,
    setAuthorizedAccounts,
    setSigner,
  };
}
