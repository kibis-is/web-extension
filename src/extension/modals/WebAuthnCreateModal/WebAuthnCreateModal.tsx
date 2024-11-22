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
  Stack,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import { randomString } from '@stablelib/random';
import React, { type FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoAddOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

// components
import AccountSelect from '@extension/components/AccountSelect';
import Button from '@extension/components/Button';
import ModalSubHeading from '@extension/components/ModalSubHeading';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@extension/constants';

// enums
import { EventTypeEnum } from '@extension/enums';

// errors
import { AuthRequestCanceledError } from '@extension/errors';

// features
import { removeEventByIdThunk } from '@extension/features/events';
import { sendWebAuthnCreateResponseThunk } from '@extension/features/webauthn';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';
import useSubTextColor from '@extension/hooks/useSubTextColor';
import useTextBackgroundColor from '@extension/hooks/useTextBackgroundColor';

// icons
import KbSignIn from '@extension/icons/KbSignIn';

// selectors
import {
  useSelectAccounts,
  useSelectAccountsFetching,
  useSelectActiveAccount,
  useSelectEvents,
  useSelectWebAuthnSaving,
} from '@extension/selectors';

// theme
import { theme } from '@extension/theme';

// types
import type {
  IAccountWithExtendedProps,
  IAppThunkDispatch,
  IBackgroundRootState,
  IMainRootState,
  IModalProps,
  IWebAuthnRequestEvent,
} from '@extension/types';
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import ellipseAddress from '@extension/utils/ellipseAddress';

const WebAuthnCreateModal: FC<IModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const dispatch =
    useDispatch<IAppThunkDispatch<IBackgroundRootState | IMainRootState>>();
  // selectors
  const accounts = useSelectAccounts();
  const activeAccount = useSelectActiveAccount();
  const events = useSelectEvents();
  const fetching = useSelectAccountsFetching();
  const saving = useSelectWebAuthnSaving();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const primaryColorScheme = usePrimaryColorScheme();
  const subTextColor = useSubTextColor();
  const textBackgroundColor = useTextBackgroundColor();
  // memos
  const _context = useMemo(() => randomString(8), []);
  const fakeHostText = useMemo(() => faker.internet.domainName(), []);
  const fakeNameText = useMemo(() => faker.commerce.productName(), []);
  // state
  const [account, setAccount] = useState<IAccountWithExtendedProps | null>(
    activeAccount
  );
  const [event, setEvent] = useState<IWebAuthnRequestEvent | null>(null);
  // handlers
  const handleOnCancelClick = async () => {
    if (event) {
      await dispatch(
        sendWebAuthnCreateResponseThunk({
          accountID: null,
          error: new AuthRequestCanceledError(
            `user dismissed webauthn request modal`
          ),
          event: event,
        })
      ).unwrap();
      // remove the event
      await dispatch(removeEventByIdThunk(event.id)).unwrap();
    }

    handleClose();
  };
  const handleClose = () => onClose && onClose();
  const handleOnRegisterClick = async () => {
    if (!event || !account) {
      return;
    }

    // send the response
    await dispatch(
      sendWebAuthnCreateResponseThunk({
        accountID: account.id,
        error: null,
        event,
      })
    ).unwrap();
    // remove the event
    await dispatch(removeEventByIdThunk(event.id)).unwrap();

    handleClose();
  };
  const handleOnAccountSelect = (value: IAccountWithExtendedProps) =>
    setAccount(value);
  // renders
  const renderContent = () => {
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

    return (
      <>
        {/*captions*/}
        <VStack
          align="center"
          justify="center"
          spacing={DEFAULT_GAP / 3}
          w="full"
        >
          <Text
            color={defaultTextColor}
            fontSize="sm"
            textAlign="center"
            width="full"
          >
            {t<string>('captions.webAuthnCreateDescription1')}
          </Text>

          <Text
            color={defaultTextColor}
            fontSize="sm"
            textAlign="center"
            width="full"
          >
            {t<string>('captions.webAuthnCreateDescription2')}
          </Text>
        </VStack>

        {/*client details*/}
        <VStack align="center" flexGrow={1} spacing={DEFAULT_GAP / 3} w="full">
          {/*icon */}
          <Avatar
            name={event.payload.message.clientInfo.appName}
            size="lg"
            {...(event.payload.message.clientInfo.iconUrl && {
              src: event.payload.message.clientInfo.iconUrl,
            })}
          />

          {/*name*/}
          <Text
            color={defaultTextColor}
            fontSize="md"
            textAlign="center"
            width="full"
          >
            {event.payload.message.clientInfo.appName}
          </Text>

          {/*host*/}
          <Box
            backgroundColor={textBackgroundColor}
            borderRadius={theme.radii['3xl']}
            px={DEFAULT_GAP / 3}
            py={1}
          >
            <Text color={defaultTextColor} fontSize="xs">
              {event.payload.message.clientInfo.host}
            </Text>
          </Box>

          <ModalSubHeading text={t<string>('headings.selectAccount')} />

          {/*account*/}
          <AccountSelect
            _context={_context}
            accounts={accounts}
            allowWatchAccounts={false}
            disabled={fetching || saving}
            label={t<string>('labels.account')}
            onSelect={handleOnAccountSelect}
            required={true}
            value={account}
          />
        </VStack>
      </>
    );
  };

  useEffect(() => {
    setEvent(
      (events.find(
        ({ type }) => type === EventTypeEnum.WebAuthnRequest
      ) as IWebAuthnRequestEvent) || null
    );
  }, [events]);
  useEffect(() => {
    if (account) {
      return;
    }

    setAccount(activeAccount);
  }, [activeAccount]);

  return (
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
            <Button
              onClick={handleOnCancelClick}
              size="lg"
              variant="outline"
              w="full"
            >
              {t<string>('buttons.cancel')}
            </Button>

            <Button
              isLoading={saving}
              onClick={handleOnRegisterClick}
              rightIcon={<KbSignIn />}
              size="lg"
              variant="solid"
              w="full"
            >
              {t<string>('buttons.register')}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default WebAuthnCreateModal;
