import {
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { type FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { IoCheckmarkOutline } from 'react-icons/io5';

// components
import Button from '@common/components/Button';
import Notice from '@common/components/Notice';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@common/constants';

// features
import type { IConfirmModal } from '@extension/features/layout';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

// selectors
import {
  useSelectConfirmModal,
  useSelectSettingsColorMode,
} from '@extension/selectors';

// theme
import { theme } from '@common/theme';

// types
import type { IModalProps } from '@extension/types';

const ConfirmModal: FC<IModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const initialRef = useRef<HTMLButtonElement | null>(null);
  // selectors
  const colorMode = useSelectSettingsColorMode();
  const defaultTextColor: string = useDefaultTextColor();
  // hooks
  const confirm: IConfirmModal | null = useSelectConfirmModal();
  // handlers
  const handleCancelClick = () => {
    if (confirm?.onCancel) {
      confirm.onCancel();
    }

    handleClose();
  };
  const handleConfirmClick = () => {
    if (confirm?.onConfirm) {
      confirm.onConfirm();
    }

    handleClose();
  };
  const handleClose = () => {
    onClose && onClose();
  };

  return (
    <Modal
      initialFocusRef={initialRef}
      isOpen={!!confirm}
      motionPreset="slideInBottom"
      onClose={handleClose}
      size="full"
      scrollBehavior="inside"
    >
      <ModalOverlay />

      <ModalContent
        alignSelf="flex-end"
        backgroundColor={BODY_BACKGROUND_COLOR}
        borderTopRadius={theme.radii['3xl']}
        borderBottomRadius={0}
        minH="0dvh"
      >
        <ModalHeader justifyContent="center" px={DEFAULT_GAP}>
          <Heading color={defaultTextColor} size="md" textAlign="center">
            {confirm?.title || t<string>('headings.confirm')}
          </Heading>
        </ModalHeader>

        <ModalBody>
          <VStack spacing={DEFAULT_GAP - 2} w="full">
            {/*description*/}
            <Text color={defaultTextColor} fontSize="sm" textAlign="left">
              {confirm?.description || t<string>('captions.defaultConfirm')}
            </Text>

            {/*warning text*/}
            {confirm?.warningText && (
              <Notice message={confirm.warningText} size="sm" type="warning" />
            )}
          </VStack>
        </ModalBody>

        <ModalFooter p={DEFAULT_GAP}>
          <HStack spacing={DEFAULT_GAP - 2} w="full">
            {/*cancel*/}
            <Button
              colorMode={colorMode}
              onClick={handleCancelClick}
              ref={initialRef}
              size="lg"
              variant="outline"
              w="full"
            >
              {t<string>('buttons.cancel')}
            </Button>

            {/*confirm*/}
            <Button
              colorMode={colorMode}
              onClick={handleConfirmClick}
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
  );
};

export default ConfirmModal;
