import React, { type FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

// features
import { handleNewEventByIdThunk } from '@provider/features/events';
import { closeCurrentWindowThunk } from '@provider/features/layout';
import { setI18nAction } from '@provider/features/system';

// hooks
import useOnAppStartup from '@provider/hooks/useOnAppStartup';
import useOnDebugLogging from '@provider/hooks/useOnDebugLogging';

// modals
import ARC0300KeyRegistrationTransactionSendEventModal from '@provider/modals/ARC0300KeyRegistrationTransactionSendEventModal';
import EnableModal from '@provider/modals/EnableModal';
import SignMessageModal from '@provider/modals/SignMessageModal';
import SignTransactionsModal from '@provider/modals/SignTransactionsModal';
import WebAuthnAuthenticateModal from '@provider/modals/WebAuthnAuthenticateModal';
import WebAuthnRegisterModal from '@provider/modals/WebAuthnRegisterModal';

// pages
import SplashPage from '@provider/pages/SplashPage';

// types
import type { IAppThunkDispatch, IBackgroundRootState, IRootProps } from '@provider/types';

// utils
import decodeURLSearchParam from '@provider/utils/decodeURLSearchParam';

const Root: FC<IRootProps> = ({ i18n }) => {
  const dispatch = useDispatch<IAppThunkDispatch<IBackgroundRootState>>();
  // misc
  const url = new URL(window.location.href);
  const eventId = decodeURLSearchParam('eventId', url.searchParams);
  // handlers
  const handleModalClose = () => dispatch(closeCurrentWindowThunk());

  useOnAppStartup();
  useEffect(() => {
    // if we don't have the necessary information, close this window
    if (!eventId) {
      dispatch(closeCurrentWindowThunk());

      return;
    }

    dispatch(setI18nAction(i18n));
  }, []);
  useEffect(() => {
    if (eventId) {
      dispatch(handleNewEventByIdThunk(eventId));
    }
  }, [eventId]);
  useOnDebugLogging();

  return (
    <>
      <EnableModal onClose={handleModalClose} />
      <SignMessageModal onClose={handleModalClose} />
      <SignTransactionsModal onClose={handleModalClose} />
      <ARC0300KeyRegistrationTransactionSendEventModal onClose={handleModalClose} />
      <WebAuthnAuthenticateModal onClose={handleModalClose} />
      <WebAuthnRegisterModal onClose={handleModalClose} />

      <SplashPage />
    </>
  );
};

export default Root;
