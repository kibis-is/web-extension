import { encode as encodeUUID } from '@agoralabs-sh/uuid';
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
  Spacer,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import { decode as decodeBase64 } from '@stablelib/base64';
import React, { type FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// components
import Button from '@common/components/Button';
import EmptyPasskeyIcon from '@common/components/EmptyPasskeyIcon';
import EmptyState from '@common/components/EmptyState';
import AccountSelect from '@extension/components/AccountSelect';
import ModalSubHeading from '@extension/components/ModalSubHeading';
import ScrollableContainer from '@extension/components/ScrollableContainer';
import Item from './Item';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@common/constants';

// enums
import { EventTypeEnum } from '@extension/enums';

// errors
import {
  BaseExtensionError,
  WebAuthnAuthenticationCanceledError,
} from '@common/errors';

// events
import WebAuthnAuthenticateRequestEvent from '@extension/events/WebAuthnAuthenticateRequestEvent';

// features
import { removeEventByIdThunk } from '@extension/features/events';
import { create as createNotification } from '@extension/features/notifications';
import {
  sendWebAuthnAuthenticateResponseThunk,
  sendWebAuthnErrorResponseThunk,
} from '@extension/features/webauthn';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useTextBackgroundColor from '@extension/hooks/useTextBackgroundColor';

// modals
import AuthenticationModal from '@extension/modals/AuthenticationModal';

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
} from '@extension/selectors';

// theme
import { theme } from '@common/theme';

// types
import type { IClientInformation } from '@common/types';
import type {
  IAccountPasskey,
  IAccountWithExtendedProps,
  IAppThunkDispatch,
  IBackgroundRootState,
  IMainRootState,
  IModalProps,
  TEncryptionCredentials,
} from '@extension/types';
import { randomString } from '@stablelib/random';

const WebAuthnAuthenticateModal: FC<IModalProps> = ({ onClose }) => {
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
  const _context = useMemo(() => randomString(8), []);
  const fakeHostText = useMemo(() => faker.internet.domainName(), []);
  const fakeNameText = useMemo(() => faker.commerce.productName(), []);
  // state
  const [account, setAccount] = useState<IAccountWithExtendedProps | null>(
    activeAccount
  );
  const [event, setEvent] = useState<WebAuthnAuthenticateRequestEvent | null>(
    null
  );
  const [selectedPasskeyID, setSelectedPasskeyID] = useState<string | null>(
    null
  );
  // memos
  const allowedCredentialIDs = useMemo(
    () =>
      event?.payload.message.payload.options.allowCredentials?.map(({ id }) =>
        encodeUUID(decodeBase64(id))
      ) || [],
    [event]
  );
  const passkeys = useMemo<IAccountPasskey[]>(() => {
    if (!account || !event) {
      return [];
    }

    // filter the passkeys by their relaying party id
    return account.passkeys.filter(
      ({ rp }) => rp.id === event.payload.message.payload.options.rpId
    );
  }, [account?.passkeys, event]);
  // handlers
  const handleOnCancelClick = async () => {
    if (event) {
      await dispatch(
        sendWebAuthnErrorResponseThunk({
          error: new WebAuthnAuthenticationCanceledError(
            `user dismissed webauthn request modal`
          ),
          event,
        })
      ).unwrap();
      // remove the event
      await dispatch(removeEventByIdThunk(event.id)).unwrap();
    }

    handleClose();
  };
  const handleClose = () => onClose && onClose();
  const handleOnAuthenticationModalConfirm = async (
    result: TEncryptionCredentials
  ) => {
    if (!event || !account || !selectedPasskeyID) {
      return;
    }

    // send the response
    await dispatch(
      sendWebAuthnAuthenticateResponseThunk({
        accountID: account.id,
        event,
        passkeyID: selectedPasskeyID,
        ...result,
      })
    ).unwrap();
    // remove the event
    await dispatch(removeEventByIdThunk(event.id)).unwrap();

    handleClose();
  };
  const handleOnAccountSelect = (value: IAccountWithExtendedProps) =>
    setAccount(value);
  const handleOnSelectPasskeyClick = (id: string) => {
    setSelectedPasskeyID(id);
    onAuthenticationModalOpen();
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
  // renders
  const renderContent = () => {
    let clientInfo: IClientInformation;

    if (!event) {
      return (
        <VStack
          align="center"
          justify="center"
          spacing={DEFAULT_GAP / 3}
          w="full"
        >
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
        {/*caption*/}
        <Text
          color={defaultTextColor}
          fontSize="sm"
          textAlign="center"
          width="full"
        >
          {t<string>('captions.webAuthnAuthenticateRequestDescription')}
        </Text>

        {/*client details*/}
        <VStack align="center" flexGrow={1} spacing={DEFAULT_GAP / 3} w="full">
          <HStack align="center" spacing={DEFAULT_GAP / 2} w="full">
            {/*icon */}
            <Avatar
              name={clientInfo.appName}
              size="md"
              {...(clientInfo.iconURL && {
                src: clientInfo.iconURL,
              })}
            />

            <VStack
              align="start"
              flexGrow={1}
              justify="space-evenly"
              spacing={DEFAULT_GAP / 3}
              w="full"
            >
              {/*name*/}
              <Text color={defaultTextColor} fontSize="sm" width="full">
                {clientInfo.appName}
              </Text>

              {/*host*/}
              <Box
                backgroundColor={textBackgroundColor}
                borderRadius={theme.radii['3xl']}
                px={DEFAULT_GAP / 3}
                py={1}
              >
                <Text color={defaultTextColor} fontSize="xs">
                  {clientInfo.host}
                </Text>
              </Box>
            </VStack>
          </HStack>

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

          <ModalSubHeading text={t<string>('headings.availablePasskeys')} />

          {passkeys.length > 0 ? (
            <ScrollableContainer>
              {passkeys.map((passkey, index) => (
                <Item
                  disabled={
                    allowedCredentialIDs.length > 0 &&
                    !allowedCredentialIDs.some((value) => value === passkey.id)
                  }
                  key={`${_context}-passkey-item-${index}`}
                  onClick={handleOnSelectPasskeyClick}
                  passkey={passkey}
                />
              ))}
            </ScrollableContainer>
          ) : (
            <VStack flexGrow={1} w="full">
              <Spacer />

              {/*empty state*/}
              <EmptyState
                colorMode={colorMode}
                icon={<EmptyPasskeyIcon colorMode={colorMode} />}
                text={t<string>('headings.noPasskeysFound')}
              />

              <Spacer />
            </VStack>
          )}
        </VStack>
      </>
    );
  };

  useEffect(() => {
    setEvent(
      (events.find(
        ({ type }) => type === EventTypeEnum.WebAuthnAuthenticateRequest
      ) as WebAuthnAuthenticateRequestEvent) || null
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
        passwordHint={t<string>(
          'captions.mustEnterPasswordToAuthenticatePasskey'
        )}
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
          {/*header*/}
          <ModalHeader justifyContent="center" px={DEFAULT_GAP}>
            <Heading
              color={defaultTextColor}
              size="md"
              textAlign="center"
              w="full"
            >
              {t<string>('headings.authenticateWithPasskey')}
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
              <Button
                colorMode={colorMode}
                onClick={handleOnCancelClick}
                size="lg"
                variant="outline"
                w="full"
              >
                {t<string>('buttons.cancel')}
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default WebAuthnAuthenticateModal;
