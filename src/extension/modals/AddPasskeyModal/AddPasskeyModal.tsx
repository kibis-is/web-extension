import {
  Code,
  Heading,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GoShieldLock } from 'react-icons/go';
import { IoKeyOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

// components
import Button from '@common/components/Button';
import CircularProgressWithIcon from '@common/components/CircularProgressWithIcon';
import CopyIconButton from '@extension/components/CopyIconButton';
import COSEAlgorithmBadge from '@extension/components/COSEAlgorithmBadge';
import ModalItem from '@extension/components/ModalItem';
import ModalTextItem from '@extension/components/ModalTextItem';
import MoreInformationAccordion from '@extension/components/MoreInformationAccordion';
import PasskeyCapabilities from '@extension/components/PasskeyCapabilities';
import ReEncryptKeysLoadingContent from '@extension/components/ReEncryptKeysLoadingContent';

// constants
import {
  BODY_BACKGROUND_COLOR,
  DEFAULT_GAP,
  MODAL_ITEM_HEIGHT,
} from '@common/constants';

// features
import { create as createNotification } from '@extension/features/notifications';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';
import useAddPasskey from './hooks/useAddPasskey';

// icons
import KbPasskey from '@extension/icons/KbPasskey';

// modals
import ConfirmPasswordModal from '@extension/modals/ConfirmPasswordModal';

// selectors
import {
  useSelectPasskeysSaving,
  useSelectSettingsColorMode,
} from '@extension/selectors';

// theme
import { theme } from '@common/theme';

// types
import type { IAppThunkDispatch, IMainRootState } from '@extension/types';
import type { IProps } from './types';

// utils
import calculateIconSize from '@common/utils/calculateIconSize';

const AddPasskeyModal: FC<IProps> = ({ addPasskey, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  const {
    isOpen: isConfirmPasswordModalOpen,
    onClose: onConfirmPasswordModalClose,
    onOpen: onConfirmPasswordModalOpen,
  } = useDisclosure();
  const {
    isOpen: isMoreInformationOpen,
    onOpen: onMoreInformationOpen,
    onClose: onMoreInformationClose,
  } = useDisclosure();
  // selectors
  const colorMode = useSelectSettingsColorMode();
  const saving = useSelectPasskeysSaving();
  // hooks
  const {
    addPasskeyAction,
    encrypting,
    encryptionProgressState,
    error,
    passkey,
    requesting,
    resetAction: resetAddPasskeyAction,
  } = useAddPasskey();
  const defaultTextColor = useDefaultTextColor();
  const subTextColor = useSubTextColor();
  // misc
  const isLoading = encrypting || requesting || saving;
  // handlers
  const handleCancelClick = async () => handleClose();
  const handleClose = () => {
    onClose && onClose();

    resetAddPasskeyAction();
  };
  const handleEncryptClick = () => onConfirmPasswordModalOpen();
  const handleOnConfirmPasswordModalConfirm = async (password: string) => {
    let success: boolean;

    if (!addPasskey) {
      return;
    }

    success = await addPasskeyAction({
      passkey: addPasskey,
      password,
    });

    if (success) {
      // display a success notification
      dispatch(
        createNotification({
          description: t<string>('captions.passkeyAdded', {
            name: addPasskey.name,
          }),
          ephemeral: true,
          title: t<string>('headings.passkeyAdded'),
          type: 'success',
        })
      );

      // close the modal
      handleClose();
    }
  };
  const handleMoreInformationToggle = (value: boolean) =>
    value ? onMoreInformationOpen() : onMoreInformationClose();
  // renders
  const renderContent = () => {
    const iconSize = calculateIconSize('xl');

    if (!addPasskey) {
      return;
    }

    if (encrypting) {
      return (
        <VStack
          alignItems="center"
          flexGrow={1}
          justifyContent="center"
          spacing={DEFAULT_GAP}
          w="full"
        >
          {/*loader*/}
          <ReEncryptKeysLoadingContent
            colorMode={colorMode}
            encryptionProgressState={encryptionProgressState}
          />
        </VStack>
      );
    }

    if (requesting) {
      return (
        <VStack
          alignItems="center"
          flexGrow={1}
          justifyContent="center"
          spacing={DEFAULT_GAP}
          w="full"
        >
          {/*passkey loader*/}
          <CircularProgressWithIcon colorMode={colorMode} icon={KbPasskey} />

          {/*caption*/}
          <Text color={subTextColor} fontSize="sm" textAlign="justify" w="full">
            {t<string>('captions.requestingPasskeyPermission', {
              name: addPasskey.name,
            })}
          </Text>
        </VStack>
      );
    }

    return (
      <VStack
        alignItems="center"
        flexGrow={1}
        justifyContent="flex-start"
        spacing={DEFAULT_GAP}
        w="full"
      >
        {/*icon*/}
        <Icon as={GoShieldLock} color="blue.600" h={iconSize} w={iconSize} />

        {/*details*/}
        <VStack flexGrow={1} spacing={DEFAULT_GAP / 3} w="full">
          {/*name*/}
          <ModalTextItem
            label={`${t<string>('labels.name')}:`}
            tooltipLabel={addPasskey.name}
            value={addPasskey.name}
          />

          {/*credential id*/}
          <ModalItem
            fontSize="xs"
            label={`${t<string>('labels.credentialID')}:`}
            value={
              <HStack spacing={1}>
                <Code
                  borderRadius="md"
                  color={defaultTextColor}
                  fontSize="xs"
                  wordBreak="break-word"
                >
                  {addPasskey.id}
                </Code>

                {/*copy credential id button*/}
                <CopyIconButton
                  ariaLabel={t<string>('labels.copyCredentialID')}
                  tooltipLabel={t<string>('labels.copyCredentialID')}
                  value={addPasskey.id}
                />
              </HStack>
            }
          />

          {/*user id*/}
          <ModalItem
            fontSize="xs"
            label={`${t<string>('labels.userID')}:`}
            value={
              <HStack spacing={1}>
                <Code
                  borderRadius="md"
                  color={defaultTextColor}
                  fontSize="xs"
                  wordBreak="break-word"
                >
                  {addPasskey.userID}
                </Code>

                {/*copy user id button*/}
                <CopyIconButton
                  ariaLabel={t<string>('labels.copyUserID')}
                  tooltipLabel={t<string>('labels.copyUserID')}
                  value={addPasskey.userID}
                />
              </HStack>
            }
          />

          {/*capabilities*/}
          <ModalItem
            fontSize="xs"
            label={`${t<string>('labels.capabilities')}:`}
            value={<PasskeyCapabilities capabilities={addPasskey.transports} />}
          />

          <MoreInformationAccordion
            color={defaultTextColor}
            fontSize="xs"
            isOpen={isMoreInformationOpen}
            minButtonHeight={MODAL_ITEM_HEIGHT}
            onChange={handleMoreInformationToggle}
          >
            <VStack spacing={0} w="full">
              {/*public key*/}
              <ModalItem
                fontSize="xs"
                label={`${t<string>('labels.publicKey')}:`}
                value={
                  <HStack spacing={1}>
                    <Code
                      borderRadius="md"
                      color={defaultTextColor}
                      fontSize="xs"
                      wordBreak="break-word"
                    >
                      {addPasskey.publicKey || '-'}
                    </Code>

                    {/*copy public key button*/}
                    {addPasskey.publicKey && (
                      <CopyIconButton
                        ariaLabel={t<string>('labels.copyPublicKey')}
                        tooltipLabel={t<string>('labels.copyPublicKey')}
                        value={addPasskey.publicKey}
                      />
                    )}
                  </HStack>
                }
              />

              {/*algorithm*/}
              <ModalItem
                fontSize="xs"
                label={`${t<string>('labels.algorithm')}:`}
                value={<COSEAlgorithmBadge algorithm={addPasskey.algorithm} />}
              />
            </VStack>
          </MoreInformationAccordion>

          {/*instructions*/}
          <VStack alignItems="center" spacing={DEFAULT_GAP / 3} w="full">
            <Text
              color={subTextColor}
              fontSize="sm"
              textAlign="justify"
              w="full"
            >
              {t<string>('captions.encryptWithPasskeyInstruction1')}
            </Text>

            <Text
              color={subTextColor}
              fontSize="sm"
              textAlign="justify"
              w="full"
            >
              {t<string>('captions.encryptWithPasskeyInstruction2')}
            </Text>
          </VStack>
        </VStack>
      </VStack>
    );
  };

  // if there is an error from the hook, show a toast
  useEffect(() => {
    error &&
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
  }, [error]);
  // if we have the updated the passkey close the modal
  useEffect(() => {
    if (passkey) {
      // display a notification
      dispatch(
        createNotification({
          description: t<string>('captions.passkeyAdded', {
            name: passkey.name,
          }),
          ephemeral: true,
          title: t<string>('headings.passkeyAdded'),
          type: 'info',
        })
      );

      handleClose();
    }
  }, [passkey]);

  return (
    <>
      {/*confirm password modal*/}
      <ConfirmPasswordModal
        hint={t<string>('captions.mustEnterPasswordToDecryptPrivateKeys')}
        isOpen={isConfirmPasswordModalOpen}
        onClose={onConfirmPasswordModalClose}
        onConfirm={handleOnConfirmPasswordModalConfirm}
      />

      <Modal
        isOpen={!!addPasskey}
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
            <Heading color={defaultTextColor} size="md" textAlign="center">
              {t<string>('headings.addPasskey')}
            </Heading>
          </ModalHeader>

          <ModalBody display="flex" px={DEFAULT_GAP}>
            {renderContent()}
          </ModalBody>

          <ModalFooter p={DEFAULT_GAP}>
            <HStack spacing={DEFAULT_GAP - 2} w="full">
              {/*cancel*/}
              <Button
                colorMode={colorMode}
                isDisabled={isLoading}
                onClick={handleCancelClick}
                size="lg"
                variant="outline"
                w="full"
              >
                {t<string>('buttons.cancel')}
              </Button>

              {/*encrypt*/}
              <Button
                colorMode={colorMode}
                isLoading={isLoading}
                onClick={handleEncryptClick}
                rightIcon={<IoKeyOutline />}
                size="lg"
                variant="solid"
                w="full"
              >
                {t<string>('buttons.encrypt')}
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddPasskeyModal;
