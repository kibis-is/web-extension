import {
  Checkbox,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { createRef, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// components
import Button from '@common/components/Button';
import Markdown from '@provider/components/Markdown';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@common/constants';

// docs
import whatsNewDocument from '@docs/whats_new.md';

// features
import { saveDisableWhatsNewOnUpdateThunk, saveWhatsNewVersionThunk } from '@provider/features/system';

// hooks
import useDefaultTextColor from '@provider/hooks/useDefaultTextColor';
import usePrimaryColorScheme from '@provider/hooks/usePrimaryColorScheme';
import useSubTextColor from '@provider/hooks/useSubTextColor';

// selectors
import { useSelectWhatsNewModal, useSelectSystemWhatsNewInfo, useSelectSettingsColorMode } from '@provider/selectors';

// theme
import { theme } from '@common/theme';

// types
import type { IAppThunkDispatch, IMainRootState, IModalProps } from '@provider/types';

const WhatsNewModal: FC<IModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  const initialRef = createRef<HTMLButtonElement>();
  // selectors
  const colorMode = useSelectSettingsColorMode();
  const whatsNewModalOpen = useSelectWhatsNewModal();
  const whatsNewInfo = useSelectSystemWhatsNewInfo();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const primaryColorScheme = usePrimaryColorScheme();
  const subTextColor = useSubTextColor();
  // handlers
  const handleClose = () => {
    // mark as read
    dispatch(saveWhatsNewVersionThunk(__VERSION__));

    onClose && onClose();
  };
  const handleOnDisableOnUpdateChange = () => {
    if (!whatsNewInfo) {
      return;
    }

    dispatch(saveDisableWhatsNewOnUpdateThunk(!whatsNewInfo.disableOnUpdate));
  };

  return (
    <Modal
      initialFocusRef={initialRef}
      isOpen={whatsNewModalOpen}
      motionPreset="slideInBottom"
      onClose={handleClose}
      size="full"
      scrollBehavior="inside"
    >
      <ModalOverlay />

      <ModalContent backgroundColor={BODY_BACKGROUND_COLOR} borderTopRadius={theme.radii['3xl']} borderBottomRadius={0}>
        <ModalHeader justifyContent="center" px={DEFAULT_GAP}>
          <Heading color={defaultTextColor} fontSize="lg" textAlign="center">
            {`What's New In Kibisis v${__VERSION__}`}
          </Heading>
        </ModalHeader>

        <ModalBody>
          <VStack spacing={DEFAULT_GAP - 2} w="full">
            <Markdown sourceAsString={whatsNewDocument} />
          </VStack>
        </ModalBody>

        <ModalFooter p={DEFAULT_GAP}>
          <VStack alignItems="flex-start" spacing={DEFAULT_GAP - 2} w="full">
            {whatsNewInfo && (
              <Checkbox
                colorScheme={primaryColorScheme}
                isChecked={whatsNewInfo.disableOnUpdate}
                onChange={handleOnDisableOnUpdateChange}
              >
                <Text color={subTextColor} fontSize="xs" textAlign="left" w="full">
                  {t<string>('captions.disableWhatsNewMessageOnUpdate')}
                </Text>
              </Checkbox>
            )}

            {/*ok*/}
            <Button colorMode={colorMode} onClick={handleClose} ref={initialRef} size="lg" variant="solid" w="full">
              {t<string>('buttons.ok')}
            </Button>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default WhatsNewModal;
