import {
  ARC0027MethodCanceledError,
  ARC0027MethodEnum,
} from '@agoralabs-sh/avm-web-provider';
import {
  Code,
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
import { encode as encodeBase64 } from '@stablelib/base64';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoCreateOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

// components
import AccountSelect from '@extension/components/AccountSelect';
import AccountItem from '@extension/components/AccountItem';
import Button from '@common/components/Button';
import ClientHeader, {
  ClientHeaderSkeleton,
} from '@extension/components/ClientHeader';
import SignMessageContentSkeleton from './SignMessageContentSkeleton';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@common/constants';

// errors
import { BaseExtensionError } from '@common/errors';

// features
import { removeEventByIdThunk } from '@extension/features/events';
import { sendSignMessageResponseThunk } from '@extension/features/messages';
import { create as createNotification } from '@extension/features/notifications';

// hooks
import useSubTextColor from '@extension/hooks/useSubTextColor';
import useSignMessageModal from './hooks/useSignMessageModal';

// modals
import AuthenticationModal from '@extension/modals/AuthenticationModal';

// repositories
import AccountRepository from '@extension/repositories/AccountRepository';

// selectors
import {
  useSelectAccountsFetching,
  useSelectLogger,
  useSelectSettingsColorMode,
  useSelectSettingsSelectedNetwork,
  useSelectSystemInfo,
} from '@extension/selectors';

// theme
import { theme } from '@common/theme';

// types
import type {
  IAccountWithExtendedProps,
  IBackgroundRootState,
  IAppThunkDispatch,
  IMainRootState,
  IModalProps,
  TEncryptionCredentials,
} from '@extension/types';

// utils
import convertPublicKeyToAVMAddress from '@common/utils/convertPublicKeyToAVMAddress';
import signBytes from '@extension/utils/signBytes';

const SignMessageModal: FC<IModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const dispatch =
    useDispatch<IAppThunkDispatch<IBackgroundRootState | IMainRootState>>();
  const {
    isOpen: isAuthenticationModalOpen,
    onClose: onAuthenticationModalClose,
    onOpen: onAuthenticationModalOpen,
  } = useDisclosure();
  // selectors
  const colorMode = useSelectSettingsColorMode();
  const fetching = useSelectAccountsFetching();
  const logger = useSelectLogger();
  const network = useSelectSettingsSelectedNetwork();
  const systemInfo = useSelectSystemInfo();
  // hooks
  const {
    authorizedAccounts,
    event,
    signer,
    setAuthorizedAccounts,
    setSigner,
  } = useSignMessageModal();
  const subTextColor = useSubTextColor();
  // handlers
  const handleAccountSelect = (account: IAccountWithExtendedProps) =>
    setSigner(account);
  const handleAuthenticationError = (error: BaseExtensionError) =>
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
  const handleCancelClick = async () => {
    if (event) {
      await dispatch(
        sendSignMessageResponseThunk({
          error: new ARC0027MethodCanceledError({
            message: `user dismissed sign message modal`,
            method: ARC0027MethodEnum.SignMessage,
            providerId: __PROVIDER_ID__,
          }),
          event,
          signature: null,
          signer: null,
        })
      ).unwrap();
      // remove the event
      await dispatch(removeEventByIdThunk(event.id)).unwrap();
    }

    handleClose();
  };
  const handleClose = () => {
    setAuthorizedAccounts(null);
    setSigner(null);

    onClose && onClose();
  };
  const handleOnAuthenticationModalConfirm = async (
    result: TEncryptionCredentials
  ) => {
    const _functionName = 'handleOnAuthenticationModalConfirm';
    let signature: Uint8Array;
    let signerAddress: string;

    if (!event || !event.payload.message.payload.params || !signer) {
      return;
    }

    signerAddress = convertPublicKeyToAVMAddress(signer.publicKey);

    logger.debug(
      `${SignMessageModal.name}#${_functionName}: signing message for signer "${signerAddress}"`
    );

    try {
      signature = await signBytes({
        bytes: new TextEncoder().encode(
          event.payload.message.payload.params.message
        ),
        logger,
        publicKey: AccountRepository.decode(signer.publicKey),
        ...result,
      });

      logger.debug(
        `${SignMessageModal.name}#${_functionName}: signed message for signer "${signerAddress}"`
      );

      // send the response
      await dispatch(
        sendSignMessageResponseThunk({
          error: null,
          event,
          signature: encodeBase64(signature),
          signer: signerAddress,
        })
      ).unwrap();
      // remove the event
      await dispatch(removeEventByIdThunk(event.id)).unwrap();

      handleClose();
    } catch (error) {
      switch (error.code) {
        default:
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

          break;
      }
    }
  };
  const handleSignClick = () => onAuthenticationModalOpen();
  // renders
  const renderContent = () => {
    if (
      fetching ||
      !event?.payload.message.payload.params ||
      !authorizedAccounts ||
      !signer
    ) {
      return <SignMessageContentSkeleton />;
    }

    return (
      <VStack spacing={DEFAULT_GAP - 2} w="full">
        {/*account select*/}
        <VStack spacing={DEFAULT_GAP / 3} w="full">
          {event.payload.message.payload.params.signer ? (
            <>
              <Text textAlign="left" w="full">{`${t<string>(
                'labels.addressToSign'
              )}:`}</Text>

              <AccountItem account={signer} colorMode={colorMode} />
            </>
          ) : (
            <>
              <Text textAlign="left" w="full">{`${t<string>(
                'labels.authorizedAddresses'
              )}:`}</Text>

              <AccountSelect
                accounts={authorizedAccounts}
                allowWatchAccounts={false}
                colorMode={colorMode}
                network={network}
                onSelect={handleAccountSelect}
                required={true}
                systemInfo={systemInfo}
                value={signer}
              />
            </>
          )}
        </VStack>

        {/*message*/}
        <VStack spacing={DEFAULT_GAP / 3} w="full">
          <Text textAlign="left" w="full">{`${t<string>(
            'labels.message'
          )}:`}</Text>
          <Code borderRadius="md" w="full">
            {event.payload.message.payload.params.message}
          </Code>
        </VStack>
      </VStack>
    );
  };

  return (
    <>
      {/*authentication modal*/}
      <AuthenticationModal
        isOpen={isAuthenticationModalOpen}
        onClose={onAuthenticationModalClose}
        onConfirm={handleOnAuthenticationModalConfirm}
        onError={handleAuthenticationError}
        passwordHint={t<string>('captions.mustEnterPasswordToSign')}
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
          <ModalHeader px={DEFAULT_GAP}>
            {event ? (
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
                  {t<string>('captions.signMessageRequest')}
                </Text>
              </VStack>
            ) : (
              <ClientHeaderSkeleton />
            )}
          </ModalHeader>

          <ModalBody px={DEFAULT_GAP}>{renderContent()}</ModalBody>

          <ModalFooter p={DEFAULT_GAP}>
            <HStack spacing={DEFAULT_GAP / 3} w="full">
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

export default SignMessageModal;
