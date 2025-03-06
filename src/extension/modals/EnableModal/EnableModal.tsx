import { ARC0027MethodCanceledError } from '@agoralabs-sh/avm-web-provider';
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
import { generateAccount } from 'algosdk';
import React, { ChangeEvent, FC, ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// components
import AccountAvatarWithBadges from '@extension/components/AccountAvatarWithBadges';
import Button from '@common/components/Button';
import NetworkBadge from '@extension/components/NetworkBadge';
import ClientHeader, {
  ClientHeaderSkeleton,
} from '@extension/components/ClientHeader';
import EmptyState from '@common/components/EmptyState';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@common/constants';

// features
import { removeEventByIdThunk } from '@extension/features/events';
import { sendEnableResponseThunk } from '@extension/features/messages';
import { saveToStorage as saveSessionToStorage } from '@extension/features/sessions';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';
import useSubTextColor from '@extension/hooks/useSubTextColor';
import useEnableModal from './hooks/useEnableModal';

// repositories
import AccountRepository from '@extension/repositories/AccountRepository';

// selectors
import {
  useSelectActiveAccount,
  useSelectAccountsFetching,
  useSelectSessionsSaving,
  useSelectSystemInfo,
  useSelectSettingsColorMode,
} from '@extension/selectors';

// theme
import { theme } from '@common/theme';

// types
import type {
  IAppThunkDispatch,
  IBackgroundRootState,
  IMainRootState,
  IModalProps,
  ISession,
} from '@extension/types';

// utils
import convertPublicKeyToAVMAddress from '@common/utils/convertPublicKeyToAVMAddress';
import ellipseAddress from '@common/utils/ellipseAddress';
import mapSessionFromEnableRequest from '@extension/utils/mapSessionFromEnableRequest';

const EnableModal: FC<IModalProps> = ({ onClose }) => {
  const _context = 'enable-modal';
  const { t } = useTranslation();
  const dispatch =
    useDispatch<IAppThunkDispatch<IBackgroundRootState | IMainRootState>>();
  // selectors
  const activeAccount = useSelectActiveAccount();
  const colorMode = useSelectSettingsColorMode();
  const fetching = useSelectAccountsFetching();
  const saving = useSelectSessionsSaving();
  const systemInfo = useSelectSystemInfo();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const {
    availableAccounts,
    event,
    network,
    setAvailableAccounts,
    setNetwork,
  } = useEnableModal();
  const primaryColorScheme = usePrimaryColorScheme();
  const subTextColor = useSubTextColor();
  // state
  const [authorizedAddresses, setAuthorizedAddresses] = useState<string[]>(
    activeAccount ? [convertPublicKeyToAVMAddress(activeAccount.publicKey)] : []
  );
  // handlers
  const handleCancelClick = async () => {
    if (event) {
      await dispatch(
        sendEnableResponseThunk({
          error: new ARC0027MethodCanceledError({
            message: `user dismissed connect modal`,
            method: event.payload.message.payload.method,
            providerId: __PROVIDER_ID__,
          }),
          event: event,
          session: null,
        })
      ).unwrap();
      // remove the event
      await dispatch(removeEventByIdThunk(event.id)).unwrap();
    }

    handleClose();
  };
  const handleClose = () => {
    setAuthorizedAddresses([]);
    setAvailableAccounts(null);
    setNetwork(null);

    if (onClose) {
      onClose();
    }
  };
  const handleConnectClick = async () => {
    let session: ISession;

    if (!event || !network || authorizedAddresses.length <= 0) {
      return;
    }

    session = mapSessionFromEnableRequest({
      authorizedAddresses,
      clientInfo: event.payload.message.payload.clientInfo,
      network,
    });

    // save the session
    dispatch(saveSessionToStorage(session));

    // send the response
    await dispatch(
      sendEnableResponseThunk({
        error: null,
        event,
        session,
      })
    ).unwrap();
    // remove the event
    await dispatch(removeEventByIdThunk(event.id)).unwrap();

    handleClose();
  };
  const handleOnAccountCheckChange =
    (address: string) => (event: ChangeEvent<HTMLInputElement>) => {
      if (!event) {
        return;
      }

      if (event.target.checked) {
        if (!authorizedAddresses.find((value) => value === address)) {
          setAuthorizedAddresses([...authorizedAddresses, address]);
        }

        return;
      }

      // remove if unchecked
      setAuthorizedAddresses(
        authorizedAddresses.filter((value) => value !== address)
      );
    };
  const handleOnSelectAllCheckChange = () => {
    if (authorizedAddresses.length <= 0) {
      return setAuthorizedAddresses(
        availableAccounts?.map((value) =>
          convertPublicKeyToAVMAddress(value.publicKey)
        ) || []
      );
    }

    setAuthorizedAddresses([]);
  };
  // renders
  const renderContent = () => {
    let accountNodes: ReactNode[];

    if (!availableAccounts || !event || fetching || !network) {
      return Array.from({ length: 3 }, (_, index) => (
        <HStack
          key={`${_context}-fetching-item-${index}`}
          py={DEFAULT_GAP - 2}
          spacing={DEFAULT_GAP - 2}
          w="full"
        >
          <SkeletonCircle size="12" />

          <Skeleton flexGrow={1}>
            <Text color={defaultTextColor} fontSize="md" textAlign="center">
              {ellipseAddress(generateAccount().addr, {
                end: 10,
                start: 10,
              })}
            </Text>
          </Skeleton>
        </HStack>
      ));
    }

    accountNodes = availableAccounts.reduce<ReactNode[]>(
      (acc, account, currentIndex) => {
        const address = convertPublicKeyToAVMAddress(
          AccountRepository.decode(account.publicKey)
        );

        return [
          ...acc,
          <HStack
            key={`${_context}-account-information-${currentIndex}`}
            py={DEFAULT_GAP - 2}
            spacing={DEFAULT_GAP - 2}
            w="full"
          >
            {/*account icon*/}
            <AccountAvatarWithBadges
              account={account}
              accounts={availableAccounts}
              colorMode={colorMode}
              network={network}
              systemInfo={systemInfo}
            />

            {/*name/address*/}
            {account.name ? (
              <VStack
                alignItems="flex-start"
                flexGrow={1}
                justifyContent="space-evenly"
                spacing={0}
              >
                <Text color={defaultTextColor} fontSize="md" textAlign="left">
                  {account.name}
                </Text>

                <Text color={subTextColor} fontSize="sm" textAlign="left">
                  {ellipseAddress(address, {
                    end: 10,
                    start: 10,
                  })}
                </Text>
              </VStack>
            ) : (
              <Text
                color={defaultTextColor}
                flexGrow={1}
                fontSize="md"
                textAlign="left"
              >
                {ellipseAddress(address, {
                  end: 10,
                  start: 10,
                })}
              </Text>
            )}

            {/*checkbox*/}
            <Checkbox
              colorScheme={primaryColorScheme}
              isChecked={
                !!authorizedAddresses?.find((value) => value === address)
              }
              onChange={handleOnAccountCheckChange(address)}
            />
          </HStack>,
        ];
      },
      []
    );

    return accountNodes.length > 0 ? (
      accountNodes
    ) : (
      <>
        <Spacer />

        {/*empty state*/}
        <EmptyState
          colorMode={colorMode}
          text={t<string>('headings.noAccountsFound')}
        />

        <Spacer />
      </>
    );
  };
  const renderHeader = () => {
    if (!event) {
      return <ClientHeaderSkeleton />;
    }

    return (
      <VStack alignItems="center" spacing={DEFAULT_GAP - 2} w="full">
        <ClientHeader
          description={
            event.payload.message.payload.clientInfo.description || undefined
          }
          iconUrl={
            event.payload.message.payload.clientInfo.iconUrl || undefined
          }
          host={event.payload.message.payload.clientInfo.host || 'unknown host'}
          name={event.payload.message.payload.clientInfo.appName || 'Unknown'}
        />

        {/*network*/}
        {network && <NetworkBadge network={network} size="xs" />}

        {/*caption*/}
        <Text color={subTextColor} fontSize="sm" textAlign="center">
          {t<string>('captions.enableRequest')}
        </Text>

        {/*select all accounts*/}
        {availableAccounts && (
          <Stack alignItems="flex-end" justifyContent="center" w="full">
            <Tooltip
              aria-label={t<string>('labels.selectAllAccounts')}
              label={t<string>('labels.selectAllAccounts')}
            >
              <Checkbox
                colorScheme={primaryColorScheme}
                isChecked={
                  authorizedAddresses.length === availableAccounts.length
                }
                isIndeterminate={
                  authorizedAddresses.length > 0 &&
                  authorizedAddresses.length < availableAccounts.length
                }
                onChange={handleOnSelectAllCheckChange}
              />
            </Tooltip>
          </Stack>
        )}
      </VStack>
    );
  };

  // when we have the available accounts, and the authorized address is empty, select the first account
  useEffect(() => {
    if (
      availableAccounts &&
      availableAccounts.length > 0 &&
      authorizedAddresses.length <= 0
    ) {
      setAuthorizedAddresses([
        convertPublicKeyToAVMAddress(
          AccountRepository.decode(availableAccounts[0].publicKey)
        ),
      ]);
    }
  }, [availableAccounts]);

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
        <ModalHeader justifyContent="center" px={DEFAULT_GAP}>
          {renderHeader()}
        </ModalHeader>

        <ModalBody px={DEFAULT_GAP}>{renderContent()}</ModalBody>

        <ModalFooter p={DEFAULT_GAP}>
          <HStack spacing={DEFAULT_GAP - 2} w="full">
            <Button
              colorMode={colorMode}
              onClick={handleCancelClick}
              size="lg"
              variant="outline"
              w="full"
            >
              {t<string>('buttons.cancel')}
            </Button>
            <Button
              colorMode={colorMode}
              isLoading={saving}
              onClick={handleConnectClick}
              size="lg"
              variant="solid"
              w="full"
            >
              {t<string>('buttons.allow')}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EnableModal;
