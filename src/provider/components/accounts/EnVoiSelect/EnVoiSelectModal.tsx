import {
  Button as ChakraButton,
  Heading,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoChevronForward } from 'react-icons/io5';

// components
import Button from '@common/components/Button';
import EmptyState from '@common/components/EmptyState';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP, TAB_ITEM_HEIGHT } from '@common/constants';

// hooks
import useButtonHoverBackgroundColor from '@provider/hooks/useButtonHoverBackgroundColor';
import useColorModeValue from '@provider/hooks/useColorModeValue';
import useDefaultTextColor from '@provider/hooks/useDefaultTextColor';
import useSubTextColor from '@provider/hooks/useSubTextColor';

// selectors
import { useSelectSettingsColorMode } from '@provider/selectors';

// theme
import { theme } from '@common/theme';

// types
import type { IEnVoiSelectModalProps } from './types';

// utils
import calculateIconSize from '@common/utils/calculateIconSize';

const EnVoiSelectModal: FC<IEnVoiSelectModalProps> = ({ context, isOpen, names, onClose, onSelect, selectedIndex }) => {
  const { t } = useTranslation();
  // selectors
  const colorMode = useSelectSettingsColorMode();
  // hooks
  const buttonHoverBackgroundColor = useButtonHoverBackgroundColor();
  const defaultTextColor = useDefaultTextColor();
  const primaryButtonTextColor = useColorModeValue(theme.colors.primaryLight['600'], theme.colors.primaryDark['600']);
  const subTextColor = useSubTextColor();
  // misc
  const iconSize = calculateIconSize('md');
  // handlers
  const handleOnChange = (value: number) => () => {
    onSelect(value);
    handleClose();
  };
  const handleCancelClick = () => handleClose();
  const handleClose = () => onClose && onClose();

  return (
    <Modal isOpen={isOpen} motionPreset="slideInBottom" onClose={handleClose} size="full" scrollBehavior="inside">
      <ModalOverlay />

      <ModalContent
        alignSelf="flex-end"
        backgroundColor={BODY_BACKGROUND_COLOR}
        borderTopRadius={theme.radii['3xl']}
        borderBottomRadius={0}
        maxH="75%"
        minH={0}
      >
        {/*heading*/}
        <ModalHeader display="flex" justifyContent="center" px={DEFAULT_GAP}>
          <VStack spacing={DEFAULT_GAP - 2} w="full">
            {/*heading*/}
            <Heading color={defaultTextColor} size="md" textAlign="center" w="full">
              {t<string>('headings.selectYourEnVoi')}
            </Heading>
          </VStack>
        </ModalHeader>

        {/*body*/}
        <ModalBody px={DEFAULT_GAP}>
          <VStack spacing={1} w="full">
            {names.length > 0 ? (
              names.map((value, index) => {
                const isSelected = selectedIndex === index;
                const textColor = isSelected ? primaryButtonTextColor : subTextColor;

                return (
                  <ChakraButton
                    _hover={{
                      bg: buttonHoverBackgroundColor,
                    }}
                    alignItems="center"
                    backgroundColor={isSelected ? buttonHoverBackgroundColor : 'transparent'}
                    borderRadius="full"
                    fontSize="md"
                    h={TAB_ITEM_HEIGHT}
                    justifyContent="space-between"
                    key={`${context}-envoi-select-modal-item-${index}`}
                    onClick={handleOnChange(index)}
                    p={DEFAULT_GAP / 3}
                    rightIcon={<Icon as={IoChevronForward} boxSize={iconSize} color={textColor} />}
                    variant="ghost"
                    w="full"
                  >
                    <Text
                      color={textColor}
                      m={0}
                      maxW={300}
                      noOfLines={1}
                      p={DEFAULT_GAP / 2}
                      textAlign="left"
                      w="full"
                    >
                      {value}
                    </Text>
                  </ChakraButton>
                );
              })
            ) : (
              <>
                <Spacer />

                {/*empty state*/}
                <EmptyState colorMode={colorMode} text={t<string>('headings.noEnVoiNamesAvailable')} />

                <Spacer />
              </>
            )}
          </VStack>
        </ModalBody>

        {/*footer*/}
        <ModalFooter p={DEFAULT_GAP}>
          <Button colorMode={colorMode} onClick={handleCancelClick} size="lg" variant="outline" w="full">
            {t<string>('buttons.cancel')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EnVoiSelectModal;
