import { randomString } from '@stablelib/random';
import {
  Checkbox,
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
import React, { type FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// components
import AccountSelect from '@extension/components/AccountSelect';
import Button from '@extension/components/Button';

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

// // icons
// import KbPasskey from '@extension/icons/K'

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
  // memos
  const _context = useMemo(() => randomString(8), []);
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
  const handleClose = () => {
    setEvent(null);

    onClose && onClose();
  };
  const handleOnSignInClick = async () => {
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

  useEffect(() => {
    setEvent(
      (events.find(
        ({ type }) => type === EventTypeEnum.WebAuthnRequest
      ) as IWebAuthnRequestEvent) || null
    );
  }, [events]);

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
        <ModalBody px={DEFAULT_GAP}>
          <VStack
            align="center"
            flexGrow={1}
            justify="center"
            spacing={DEFAULT_GAP / 2}
            w="full"
          >
            {/*account*/}
            <AccountSelect
              _context={_context}
              accounts={accounts}
              disabled={fetching || saving}
              label={t<string>('labels.account')}
              onSelect={handleOnAccountSelect}
              required={true}
              selectModalTitle={t<string>('headings.signInWithAccount')}
              value={account}
            />
          </VStack>
        </ModalBody>

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
              onClick={handleOnSignInClick}
              size="lg"
              variant="solid"
              w="full"
            >
              {t<string>('buttons.signIn')}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default WebAuthnCreateModal;
