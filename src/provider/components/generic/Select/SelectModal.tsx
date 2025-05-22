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
  VStack,
} from '@chakra-ui/react';
import { randomString } from '@stablelib/random';
import React, { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IoChevronForward } from 'react-icons/io5';

// components
import Button from '@common/components/Button';
import EmptyState from '@common/components/EmptyState';
import SelectOption from './SelectOption';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP, TAB_ITEM_HEIGHT } from '@common/constants';

// hooks
import useButtonHoverBackgroundColor from '@provider/hooks/useButtonHoverBackgroundColor';
import useColorModeValue from '@provider/hooks/useColorModeValue';
import useDefaultTextColor from '@provider/hooks/useDefaultTextColor';
import useSubTextColor from '@provider/hooks/useSubTextColor';

// theme
import { theme } from '@common/theme';

// types
import type { TSelectModalProps } from './types';

// utils
import calculateIconSize from '@common/utils/calculateIconSize';

const SelectModal: FC<TSelectModalProps> = ({
  colorMode,
  emptySpaceMessage,
  isOpen,
  onClose,
  onSelect,
  options,
  selectedIndex,
  title,
}) => {
  const { t } = useTranslation();
  // hooks
  const buttonHoverBackgroundColor = useButtonHoverBackgroundColor();
  const defaultTextColor = useDefaultTextColor();
  const primaryButtonTextColor: string = useColorModeValue(
    theme.colors.primaryLight['600'],
    theme.colors.primaryDark['600']
  );
  const subTextColor = useSubTextColor();
  // memos
  const _context = useMemo(() => randomString(8), []);
  // misc
  const iconSize = calculateIconSize('md');
  // handlers
  const handleOnChange = (index: number) => () => {
    onSelect(index);
    handleClose();
  };
  const handleCancelClick = () => handleClose();
  const handleClose = () => onClose && onClose();
  // renders
  const renderContent = () => {
    if (options.length <= 0) {
      return (
        <>
          <Spacer />

          {/*empty state*/}
          <EmptyState colorMode={colorMode} text={emptySpaceMessage || t<string>('headings.noItemsFound')} />

          <Spacer />
        </>
      );
    }

    return options.map((value, index) => {
      const isSelected = selectedIndex === index;
      const fontColor = isSelected ? primaryButtonTextColor : subTextColor;

      return (
        <ChakraButton
          _hover={{
            bg: buttonHoverBackgroundColor,
          }}
          backgroundColor={isSelected ? buttonHoverBackgroundColor : 'transparent'}
          borderRadius="full"
          fontSize="md"
          h={TAB_ITEM_HEIGHT}
          justifyContent="space-between"
          key={`${_context}-select-modal-item-${index}`}
          onClick={handleOnChange(index)}
          py={DEFAULT_GAP / 3}
          px={DEFAULT_GAP / 2}
          rightIcon={<Icon as={IoChevronForward} boxSize={iconSize} color={fontColor} />}
          variant="ghost"
          w="full"
        >
          <SelectOption color={fontColor} fontSize="md" value={value} />
        </ChakraButton>
      );
    });
  };

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
              {t<string>(title || 'headings.selectAnOption')}
            </Heading>
          </VStack>
        </ModalHeader>

        {/*body*/}
        <ModalBody px={DEFAULT_GAP}>
          <VStack spacing={1} w="full">
            {renderContent()}
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

export default SelectModal;
