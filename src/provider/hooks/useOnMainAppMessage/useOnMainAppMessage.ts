import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import browser from 'webextension-polyfill';

// enums
import { ProviderMessageReferenceEnum } from '@common/enums';

// features
import { setActive as setCredentialLockActive } from '@provider/features/credential-lock';
import { handleNewEventByIdThunk } from '@provider/features/events';
import { create as createNotification } from '@provider/features/notifications';
import { fetchFromStorageThunk as fetchSessionsFromStorageThunk } from '@provider/features/sessions';

// messages
import BaseProviderMessage from '@common/messages/BaseProviderMessage';
import ProviderEventAddedMessage from '@common/messages/ProviderEventAddedMessage';
import ProviderSessionsUpdatedMessage from '@common/messages/ProviderSessionsUpdatedMessage';

// selectors
import { useSelectLogger } from '@provider/selectors';

// types
import type { IAppThunkDispatch, IMainRootState } from '@provider/types';

export default function useOnMainAppMessage(): void {
  const __function = 'useOnMainAppMessage';
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  // selectors
  const logger = useSelectLogger();
  const handleMessage = async (message: BaseProviderMessage) => {
    message.reference && logger.debug(`${__function}: message "${message.reference}" received`);

    switch (message.reference) {
      case ProviderMessageReferenceEnum.EventAdded:
        dispatch(handleNewEventByIdThunk((message as ProviderEventAddedMessage).payload.eventId));
        break;
      case ProviderMessageReferenceEnum.CredentialLockActivated:
        dispatch(setCredentialLockActive(true));
        break;
      case ProviderMessageReferenceEnum.SessionsUpdated:
        dispatch(fetchSessionsFromStorageThunk());
        dispatch(
          createNotification({
            ephemeral: true,
            type: 'info',
            ...((message as ProviderSessionsUpdatedMessage).payload.sessions.length > 1
              ? {
                  title: t<string>('headings.sessionsDisconnected', {
                    amount: (message as ProviderSessionsUpdatedMessage).payload.sessions.length,
                  }),
                }
              : {
                  description: t<string>('captions.sessionDisconnected', {
                    name: (message as ProviderSessionsUpdatedMessage).payload.sessions[0].appName,
                  }),
                  title: t<string>('headings.sessionDisconnected'),
                }),
          })
        );
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    // handle messages
    browser.runtime.onMessage.addListener(handleMessage);

    return function cleanup() {
      browser.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);
}
