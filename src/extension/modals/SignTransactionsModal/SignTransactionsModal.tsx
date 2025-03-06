import {
  ARC0027ErrorCodeEnum,
  ARC0027MethodCanceledError,
  ARC0027MethodEnum,
} from '@agoralabs-sh/avm-web-provider';
import {
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { decode as decodeBase64 } from '@stablelib/base64';
import { Transaction } from 'algosdk';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoArrowBackOutline, IoCreateOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

// components
import Button from '@common/components/Button';
import ClientHeader, {
  ClientHeaderSkeleton,
} from '@extension/components/ClientHeader';
import AtomicTransactionsContent from './AtomicTransactionsContent';
import GroupOfTransactionsContent from './GroupOfTransactionsContent';
import SingleTransactionContent from './SingleTransactionContent';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@common/constants';

// contexts
import { MultipleTransactionsContext } from './contexts';

// errors
import { BaseExtensionError } from '@common/errors';

// features
import { removeEventByIdThunk } from '@extension/features/events';
import { sendSignTransactionsResponseThunk } from '@extension/features/messages';
import { create as createNotification } from '@extension/features/notifications';

// hooks
import useSubTextColor from '@extension/hooks/useSubTextColor';
import useSignTransactionsModal from './hooks/useSignTransactionsModal';

// modals
import AuthenticationModal from '@extension/modals/AuthenticationModal';

// selectors
import {
  useSelectAccounts,
  useSelectLogger,
  useSelectNetworks,
  useSelectSessions,
  useSelectSettingsColorMode,
} from '@extension/selectors';

// theme
import { theme } from '@common/theme';

// types
import type {
  IAccountWithExtendedProps,
  IAppThunkDispatch,
  IBackgroundRootState,
  IMainRootState,
  IModalProps,
  TEncryptionCredentials,
} from '@extension/types';

// utils
import decodeUnsignedTransaction from '@extension/utils/decodeUnsignedTransaction';
import groupTransactions from '@extension/utils/groupTransactions';
import authorizedAccountsForEvent from './utils/authorizedAccountsForEvent';
import signTransactions from './utils/signTransactions';

const SignTransactionsModal: FC<IModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const dispatch =
    useDispatch<IAppThunkDispatch<IBackgroundRootState | IMainRootState>>();
  const {
    isOpen: isAuthenticationModalOpen,
    onClose: onAuthenticationModalClose,
    onOpen: onAuthenticationModalOpen,
  } = useDisclosure();
  // selectors
  const accounts = useSelectAccounts();
  const colorMode = useSelectSettingsColorMode();
  const logger = useSelectLogger();
  const networks = useSelectNetworks();
  const sessions = useSelectSessions();
  // hooks
  const { event } = useSignTransactionsModal();
  const subTextColor = useSubTextColor();
  // states
  const [moreDetailsTransactions, setMoreDetailsTransactions] = useState<
    Transaction[] | null
  >(null);
  const [signing, setSigning] = useState<boolean>(false);
  // handlers
  const handleCancelClick = async () => {
    if (event) {
      await dispatch(
        sendSignTransactionsResponseThunk({
          error: new ARC0027MethodCanceledError({
            message: `user dismissed sign transaction modal`,
            method: ARC0027MethodEnum.SignTransactions,
            providerId: __PROVIDER_ID__,
          }),
          event,
          stxns: null,
        })
      ).unwrap();
      // remove the event
      await dispatch(removeEventByIdThunk(event.id)).unwrap();
    }

    handleClose();
  };
  const handleClose = () => {
    setMoreDetailsTransactions(null);
    setSigning(false);

    onClose && onClose();
  };
  const handleOnAuthenticationModalConfirm = async (
    result: TEncryptionCredentials
  ) => {
    const _functionName = 'handleOnAuthenticationModalConfirm';
    let authorizedAccounts: IAccountWithExtendedProps[];
    let stxns: (string | null)[];

    if (!event || !event.payload.message.payload.params) {
      return;
    }

    setSigning(true);

    try {
      authorizedAccounts = await authorizedAccountsForEvent({
        accounts,
        event,
        logger,
        networks,
        sessions,
      });
      stxns = await signTransactions({
        accounts: authorizedAccounts,
        arc0001Transactions: event.payload.message.payload.params.txns,
        authAccounts: accounts,
        logger,
        networks,
        ...result,
      });

      // send a response
      await dispatch(
        sendSignTransactionsResponseThunk({
          error: null,
          event,
          stxns,
        })
      ).unwrap();
      // remove the event
      await dispatch(removeEventByIdThunk(event.id)).unwrap();

      handleClose();
    } catch (error) {
      logger.error(`${SignTransactionsModal.name}#${_functionName}:`, error);

      switch (error.code) {
        case ARC0027ErrorCodeEnum.UnauthorizedSignerError:
          dispatch(
            sendSignTransactionsResponseThunk({
              error,
              event,
              stxns: null,
            })
          );

          handleClose();
          break;
        default:
          handleOnError(error);

          break;
      }
    }

    setSigning(false);
  };
  const handleOnError = (error: BaseExtensionError) =>
    dispatch(
      createNotification({
        description: t<string>('errors.descriptions.code', {
          code: error.code,
          context: error.code,
        }),
        ephemeral: true,
        title: t<string>('errors.titles.code', { context: error.code }),
        type: 'error',
      })
    );
  const handlePreviousClick = () => setMoreDetailsTransactions(null);
  const handleSignClick = async () => onAuthenticationModalOpen();
  const renderContent = () => {
    let decodedTransactions: Transaction[];
    let groupsOfTransactions: Transaction[][];

    if (!event || !event.payload.message.payload.params) {
      return <VStack spacing={DEFAULT_GAP - 2} w="full"></VStack>;
    }

    decodedTransactions = event.payload.message.payload.params.txns.map(
      (value) => decodeUnsignedTransaction(decodeBase64(value.txn))
    );
    groupsOfTransactions = groupTransactions(decodedTransactions);

    // if we have multiple groups/single transactions
    if (groupsOfTransactions.length > 1) {
      return (
        <MultipleTransactionsContext.Provider
          value={{
            moreDetailsTransactions,
            setMoreDetailsTransactions,
          }}
        >
          <GroupOfTransactionsContent
            groupsOfTransactions={groupsOfTransactions}
          />
        </MultipleTransactionsContext.Provider>
      );
    }

    // if the group of transactions is a greater that one, it will be atomic transactions
    if (groupsOfTransactions[0].length > 1) {
      return (
        <AtomicTransactionsContent transactions={groupsOfTransactions[0]} />
      );
    }

    // otherwise it is a single transaction
    return (
      <SingleTransactionContent transaction={groupsOfTransactions[0][0]} />
    );
  };

  return (
    <>
      {/*authentication*/}
      <AuthenticationModal
        isOpen={isAuthenticationModalOpen}
        onClose={onAuthenticationModalClose}
        onConfirm={handleOnAuthenticationModalConfirm}
        onError={handleOnError}
        {...(event &&
          event.payload.message.payload.params && {
            passwordHint: t<string>(
              event.payload.message.payload.params.txns.length > 1
                ? 'captions.mustEnterPasswordToSignTransactions'
                : 'captions.mustEnterPasswordToSignTransaction'
            ),
          })}
      />

      <Modal
        isOpen={!!event}
        motionPreset="slideInBottom"
        onClose={handleClose}
        size="full"
        scrollBehavior="inside"
      >
        <ModalContent
          backgroundColor={BODY_BACKGROUND_COLOR}
          borderTopRadius={theme.radii['3xl']}
          borderBottomRadius={0}
        >
          <ModalHeader justifyContent="center" px={DEFAULT_GAP}>
            {event && event.payload.message.payload.params ? (
              <VStack alignItems="center" spacing={DEFAULT_GAP - 2} w="full">
                <ClientHeader
                  description={
                    event.payload.message.payload.clientInfo.description ||
                    undefined
                  }
                  iconUrl={
                    event.payload.message.payload.clientInfo.iconUrl ||
                    undefined
                  }
                  host={
                    event.payload.message.payload.clientInfo.host ||
                    'unknown host'
                  }
                  name={
                    event.payload.message.payload.clientInfo.appName ||
                    'Unknown'
                  }
                />

                {/*caption*/}
                <Text color={subTextColor} fontSize="sm" textAlign="center">
                  {t<string>(
                    event.payload.message.payload.params.txns.length > 1
                      ? 'captions.signTransactionsRequest'
                      : 'captions.signTransactionRequest'
                  )}
                </Text>
              </VStack>
            ) : (
              <ClientHeaderSkeleton />
            )}
          </ModalHeader>

          <ModalBody px={DEFAULT_GAP}>{renderContent()}</ModalBody>

          <ModalFooter p={DEFAULT_GAP}>
            <HStack spacing={DEFAULT_GAP - 2} w="full">
              {moreDetailsTransactions && moreDetailsTransactions.length > 0 ? (
                // previous button
                <Button
                  colorMode={colorMode}
                  leftIcon={<IoArrowBackOutline />}
                  onClick={handlePreviousClick}
                  size="lg"
                  variant="outline"
                  w="full"
                >
                  {t<string>('buttons.previous')}
                </Button>
              ) : (
                // cancel button
                <Button
                  colorMode={colorMode}
                  onClick={handleCancelClick}
                  size="lg"
                  variant="outline"
                  w="full"
                >
                  {t<string>('buttons.cancel')}
                </Button>
              )}

              {/*sign button*/}
              <Button
                colorMode={colorMode}
                isLoading={signing}
                onClick={handleSignClick}
                rightIcon={<IoCreateOutline />}
                size="lg"
                variant="solid"
                w="full"
              >
                {t<string>('buttons.sign')}
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SignTransactionsModal;
