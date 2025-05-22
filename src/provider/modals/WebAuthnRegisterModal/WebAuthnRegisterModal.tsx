import {
  Avatar,
  Box,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Skeleton,
  SkeletonCircle,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import React, { type FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoCheckmarkOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

// components
import AccountSelect from '@provider/components/accounts/AccountSelect';
import Button from '@common/components/Button';
import ModalSubHeading from '@provider/components/modals/ModalSubHeading';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@common/constants';

// enums
import { EventTypeEnum } from '@provider/enums';

// errors
import { BaseExtensionError, WebAuthnRegistrationCanceledError } from '@common/errors';

// events
import WebAuthnRegisterRequestEvent from '@provider/events/WebAuthnRegisterRequestEvent';

// features
import { removeEventByIdThunk } from '@provider/features/events';
import { create as createNotification } from '@provider/features/notifications';
import { sendWebAuthnErrorResponseThunk, sendWebAuthnRegisterResponseThunk } from '@provider/features/webauthn';

// hooks
import useDefaultTextColor from '@provider/hooks/useDefaultTextColor';
import useTextBackgroundColor from '@provider/hooks/useTextBackgroundColor';

// modals
import AuthenticationModal from '@provider/modals/AuthenticationModal';

// selectors
import {
  useSelectAccounts,
  useSelectAccountsFetching,
  useSelectActiveAccount,
  useSelectEvents,
  useSelectSettingsColorMode,
  useSelectSettingsSelectedNetwork,
  useSelectSystemInfo,
  useSelectWebAuthnSaving,
} from '@provider/selectors';

// theme
import { theme } from '@common/theme';

// types
import type { IClientInformation } from '@common/types';
import type {
  IAccountWithExtendedProps,
  IAppThunkDispatch,
  IBackgroundRootState,
  IMainRootState,
  IModalProps,
  TEncryptionCredentials,
} from '@provider/types';

const WebAuthnRegisterModal: FC<IModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IBackgroundRootState | IMainRootState>>();
  const {
    isOpen: isAuthenticationModalOpen,
    onClose: onAuthenticationModalClose,
    onOpen: onAuthenticationModalOpen,
  } = useDisclosure();
  // selectors
  const accounts = useSelectAccounts();
  const activeAccount = useSelectActiveAccount();
  const colorMode = useSelectSettingsColorMode();
  const events = useSelectEvents();
  const fetching = useSelectAccountsFetching();
  const network = useSelectSettingsSelectedNetwork();
  const saving = useSelectWebAuthnSaving();
  const systemInfo = useSelectSystemInfo();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const textBackgroundColor = useTextBackgroundColor();
  // memos
  const fakeHostText = useMemo(() => faker.internet.domainName(), []);
  const fakeNameText = useMemo(() => faker.commerce.productName(), []);
  // state
  const [account, setAccount] = useState<IAccountWithExtendedProps | null>(activeAccount);
  const [event, setEvent] = useState<WebAuthnRegisterRequestEvent | null>(null);
  // handlers
  const handleOnCancelClick = async () => {
    if (event) {
      await dispatch(
        sendWebAuthnErrorResponseThunk({
          error: new WebAuthnRegistrationCanceledError(`user dismissed webauthn request modal`),
          event: event,
        })
      ).unwrap();
      // remove the event
      await dispatch(removeEventByIdThunk(event.id)).unwrap();
    }

    handleClose();
  };
  const handleClose = () => onClose && onClose();
  const handleOnAuthenticationModalConfirm = async (result: TEncryptionCredentials) => {
    if (!event || !account) {
      return;
    }

    // send the response
    await dispatch(
      sendWebAuthnRegisterResponseThunk({
        accountID: account.id,
        event,
        ...result,
      })
    ).unwrap();
    // remove the event
    await dispatch(removeEventByIdThunk(event.id)).unwrap();

    handleClose();
  };
  const handleOnAccountSelect = (value: IAccountWithExtendedProps) => setAccount(value);
  const handleOnConfirmClick = () => onAuthenticationModalOpen();
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
  // renders
  const renderContent = () => {
    let clientInfo: IClientInformation;

    if (!event || !network) {
      return (
        <VStack align="center" justify="center" spacing={DEFAULT_GAP / 3} w="full">
          {/*icons*/}
          <SkeletonCircle size="10" />

          {/*host*/}
          <Skeleton>
            <Text fontSize="xs">{fakeHostText}</Text>
          </Skeleton>

          {/*name*/}
          <Skeleton>
            <Text size="sm" w="full">
              {fakeNameText}
            </Text>
          </Skeleton>
        </VStack>
      );
    }

    clientInfo = event.payload.message.payload.clientInfo;

    return (
      <>
        {/*captions*/}
        <VStack align="center" justify="center" spacing={DEFAULT_GAP / 3} w="full">
          <Text color={defaultTextColor} fontSize="sm" textAlign="center" width="full">
            {t<string>('captions.webAuthnRegisterRequestDescription1')}
          </Text>

          <Text color={defaultTextColor} fontSize="sm" textAlign="center" width="full">
            {t<string>('captions.webAuthnRegisterRequestDescription2')}
          </Text>
        </VStack>

        {/*client details*/}
        <VStack align="center" flexGrow={1} spacing={DEFAULT_GAP / 3} w="full">
          {/*icon */}
          <Avatar
            name={clientInfo.appName}
            size="lg"
            {...(clientInfo.iconURL && {
              src: clientInfo.iconURL,
            })}
          />

          {/*name*/}
          <Text color={defaultTextColor} fontSize="md" textAlign="center" width="full">
            {clientInfo.appName}
          </Text>

          {/*host*/}
          <Box backgroundColor={textBackgroundColor} borderRadius={theme.radii['3xl']} px={DEFAULT_GAP / 3} py={1}>
            <Text color={defaultTextColor} fontSize="xs">
              {clientInfo.host}
            </Text>
          </Box>

          <ModalSubHeading text={t<string>('headings.selectAccount')} />

          {/*account*/}
          <AccountSelect
            accounts={accounts}
            allowWatchAccounts={false}
            colorMode={colorMode}
            disabled={fetching || saving}
            label={t<string>('labels.account')}
            network={network}
            onSelect={handleOnAccountSelect}
            required={true}
            systemInfo={systemInfo}
            value={account}
          />
        </VStack>
      </>
    );
  };

  useEffect(() => {
    setEvent(
      (events.find(({ type }) => type === EventTypeEnum.WebAuthnRegisterRequest) as WebAuthnRegisterRequestEvent) ||
        null
    );
  }, [events]);
  useEffect(() => {
    if (account) {
      return;
    }

    setAccount(activeAccount);
  }, [activeAccount]);

  return (
    <>
      {/*authentication modal*/}
      <AuthenticationModal
        isOpen={isAuthenticationModalOpen}
        onClose={onAuthenticationModalClose}
        onConfirm={handleOnAuthenticationModalConfirm}
        onError={handleOnError}
        passwordHint={t<string>('captions.mustEnterPasswordToRegisterPasskey')}
      />

      <Modal isOpen={!!event} motionPreset="slideInBottom" onClose={handleClose} size="full" scrollBehavior="inside">
        <ModalContent
          backgroundColor={BODY_BACKGROUND_COLOR}
          borderTopRadius={theme.radii['3xl']}
          borderBottomRadius={0}
        >
          {/*header*/}
          <ModalHeader justifyContent="center" px={DEFAULT_GAP}>
            <Heading color={defaultTextColor} size="md" textAlign="center" w="full">
              {t<string>('headings.registerPasskey')}
            </Heading>
          </ModalHeader>

          {/*body*/}
          <ModalBody display="flex" px={DEFAULT_GAP}>
            <VStack align="center" flexGrow={1} spacing={DEFAULT_GAP} w="full">
              {renderContent()}
            </VStack>
          </ModalBody>

          {/*footer*/}
          <ModalFooter p={DEFAULT_GAP}>
            <HStack spacing={DEFAULT_GAP - 2} w="full">
              <Button colorMode={colorMode} onClick={handleOnCancelClick} size="lg" variant="outline" w="full">
                {t<string>('buttons.cancel')}
              </Button>

              <Button
                colorMode={colorMode}
                isLoading={saving}
                onClick={handleOnConfirmClick}
                rightIcon={<IoCheckmarkOutline />}
                size="lg"
                variant="solid"
                w="full"
              >
                {t<string>('buttons.confirm')}
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default WebAuthnRegisterModal;
