import {
  Button as ChakraButton,
  Icon,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import React, { type FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoChevronDownOutline } from 'react-icons/io5';

// components
import Label from '@common/components/Label';
import SelectOption from '@extension/components/Select/SelectOption';

// constants
import { DEFAULT_GAP, INPUT_HEIGHT } from '@common/constants';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useBorderColor from '@extension/hooks/useBorderColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// modals
import SelectModal from './SelectModal';

// theme
import { theme } from '@common/theme';

// types
import type { IProps } from './types';

// utils
import calculateIconSize from '@common/utils/calculateIconSize';

const Select: FC<IProps> = ({
  buttonTooltipLabel,
  colorMode,
  disabled = false,
  emptyOptionLabel,
  label,
  modalEmptySpaceMessage,
  modalTitle,
  onSelect,
  options,
  required = false,
  value,
}) => {
  const { t } = useTranslation();
  const {
    isOpen: isSelectModalOpen,
    onClose: onSelectClose,
    onOpen: onSelectModalOpen,
  } = useDisclosure();
  // states
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  // hooks
  const borderColor = useBorderColor();
  const buttonHoverBackgroundColor = useButtonHoverBackgroundColor();
  const disabledBackgroundColor: string = useColorModeValue(
    theme.colors.gray['300'],
    theme.colors.whiteAlpha['300']
  );
  const subTextColor = useSubTextColor();
  // misc
  const iconSize = calculateIconSize('sm');
  // handlers
  const handleOnClick = () => !disabled && onSelectModalOpen();
  const handleOnSelect = (index: number) => {
    setSelectedIndex(index);
    onSelect(options[index] || -1);
  };

  useEffect(() => {
    let index: number;

    if (!value) {
      return;
    }

    index = options.findIndex(
      (_value) => JSON.stringify(_value) === JSON.stringify(value)
    );

    index >= 0 && setSelectedIndex(index);
  }, []);

  return (
    <>
      {/*select modal*/}
      <SelectModal
        colorMode={colorMode}
        emptySpaceMessage={modalEmptySpaceMessage}
        isOpen={isSelectModalOpen}
        onClose={onSelectClose}
        onSelect={handleOnSelect}
        options={options}
        title={modalTitle}
        {...(selectedIndex >= 0 && {
          selectedIndex,
        })}
      />

      <VStack alignItems="flex-start" spacing={DEFAULT_GAP / 3} w="full">
        {/*label*/}
        {label && (
          <Label colorMode={colorMode} label={label} required={required} />
        )}

        <Tooltip
          label={t<string>(buttonTooltipLabel || 'labels.openSelectModal')}
        >
          <ChakraButton
            _hover={{
              bg: !disabled
                ? buttonHoverBackgroundColor
                : disabledBackgroundColor,
            }}
            aria-label={label || 'labels.openSelectModal'}
            alignItems="center"
            backgroundColor={
              !disabled ? 'transparent' : disabledBackgroundColor
            }
            borderColor={borderColor}
            borderStyle="solid"
            borderWidth="1px"
            borderRadius="full"
            cursor={!disabled ? 'pointer' : 'not-allowed'}
            fontSize="md"
            h={INPUT_HEIGHT}
            justifyContent="space-between"
            onClick={handleOnClick}
            px={DEFAULT_GAP / 2}
            py={DEFAULT_GAP / 3}
            rightIcon={
              <Icon
                as={IoChevronDownOutline}
                boxSize={iconSize}
                color={subTextColor}
              />
            }
            variant="ghost"
            w="full"
          >
            {value ? (
              <SelectOption value={value} />
            ) : (
              <Text color={subTextColor} fontSize="sm" maxW={250} noOfLines={1}>
                {t<string>(emptyOptionLabel || 'placeholders.pleaseSelect')}
              </Text>
            )}
          </ChakraButton>
        </Tooltip>
      </VStack>
    </>
  );
};

export default Select;
