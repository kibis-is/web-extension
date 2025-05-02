import {
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
import React, { type FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { IoTrashOutline } from 'react-icons/io5';
import { GoShieldSlash } from 'react-icons/go';
import { useDispatch } from 'react-redux';

// components
import Button from '@common/components/Button';
import CircularProgressWithIcon from '@common/components/CircularProgressWithIcon';
import ReEncryptKeysLoadingContent from '@extension/components/ReEncryptKeysLoadingContent';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@common/constants';

// features
import { create as createNotification } from '@extension/features/notifications';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';
import useRemovePasskey from './hooks/useRemovePasskey';

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

const RemovePasskeyModal: FC<IProps> = ({ onClose, removePasskey }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  const {
    isOpen: isConfirmPasswordModalOpen,
    onClose: onConfirmPasswordModalClose,
    onOpen: onConfirmPasswordModalOpen,
  } = useDisclosure();
  // selectors
  const colorMode = useSelectSettingsColorMode();
  const saving = useSelectPasskeysSaving();
  // hooks
  const {
    encrypting,
    encryptionProgressState,
    error,
    removePasskeyAction,
    requesting,
    resetAction: resetRemovePasskeyAction,
  } = useRemovePasskey();
  const defaultTextColor = useDefaultTextColor();
  const subTextColor = useSubTextColor();
  // misc
  const isLoading = encrypting || requesting || saving;
  // handlers
  const handleCancelClick = async () => handleClose();
  const handleClose = () => {
    resetRemovePasskeyAction();

    onClose && onClose();
  };
  const handleOnConfirmPasswordModalConfirm = async (password: string) => {
    let success: boolean;

    if (!removePasskey) {
      return;
    }

    success = await removePasskeyAction({
      passkey: removePasskey,
      password,
    });

    if (success) {
      // display a success notification
      dispatch(
        createNotification({
          description: t<string>('captions.passkeyRemoved', {
            name: removePasskey.name,
          }),
          ephemeral: true,
          title: t<string>('headings.passkeyRemoved'),
          type: 'info',
        })
      );

      // close the modal
      handleClose();
    }
  };
  const handleRemoveClick = () => onConfirmPasswordModalOpen();
  // renders
  const renderContent = () => {
    const iconSize = calculateIconSize('xl');

    if (!removePasskey) {
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
              name: removePasskey.name,
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
        <Icon as={GoShieldSlash} color="red.600" h={iconSize} w={iconSize} />

        {/*description*/}
        <Text
          as="b"
          color={subTextColor}
          fontSize="sm"
          textAlign="center"
          w="full"
        >
          {t<string>('captions.removePasskey', { name: removePasskey.name })}
        </Text>

        {/*instructions*/}
        <VStack alignItems="center" spacing={DEFAULT_GAP / 3} w="full">
          <Text color={subTextColor} fontSize="sm" textAlign="justify" w="full">
            {t<string>('captions.removePasskeyInstruction1')}
          </Text>

          <Text color={subTextColor} fontSize="sm" textAlign="justify" w="full">
            {t<string>('captions.removePasskeyInstruction2')}
          </Text>
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

  return (
    <>
      {/*confirm password modal*/}
      <ConfirmPasswordModal
        hint={t<string>('captions.mustEnterPasswordToReEncryptPrivateKeys')}
        isOpen={isConfirmPasswordModalOpen}
        onClose={onConfirmPasswordModalClose}
        onConfirm={handleOnConfirmPasswordModalConfirm}
      />

      <Modal
        isOpen={!!removePasskey}
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
              {t<string>('headings.removePasskey')}
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

              {/*remove*/}
              <Button
                colorMode={colorMode}
                isLoading={isLoading}
                onClick={handleRemoveClick}
                rightIcon={<IoTrashOutline />}
                size="lg"
                variant="solid"
                w="full"
              >
                {t<string>('buttons.remove')}
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RemovePasskeyModal;
