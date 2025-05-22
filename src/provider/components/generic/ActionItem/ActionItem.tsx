import { Button as ChakraButton, HStack, Icon, Text } from '@chakra-ui/react';
import React, { type FC } from 'react';
import { IoChevronForward } from 'react-icons/io5';

// constants
import { DEFAULT_GAP, TAB_ITEM_HEIGHT } from '@common/constants';

// hooks
import useButtonHoverBackgroundColor from '@provider/hooks/useButtonHoverBackgroundColor';
import useColorModeValue from '@provider/hooks/useColorModeValue';
import useSubTextColor from '@provider/hooks/useSubTextColor';

// theme
import { theme } from '@common/theme';

// types
import type { IProps } from './types';

// utils
import calculateIconSize from '@common/utils/calculateIconSize';

const ActionItem: FC<IProps> = ({ icon, isSelected = false, label, onClick }) => {
  // hooks
  const buttonHoverBackgroundColor = useButtonHoverBackgroundColor();
  const primaryButtonTextColor: string = useColorModeValue(
    theme.colors.primaryLight['600'],
    theme.colors.primaryDark['600']
  );
  const subTextColor = useSubTextColor();
  // misc
  const iconSize = calculateIconSize('md');
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
      onClick={onClick}
      p={DEFAULT_GAP / 3}
      rightIcon={<Icon as={IoChevronForward} boxSize={iconSize} color={textColor} />}
      variant="ghost"
      w="full"
    >
      <HStack
        alignItems="center"
        justifyContent="flex-start"
        m={0}
        p={DEFAULT_GAP / 2}
        spacing={DEFAULT_GAP - 2}
        w="full"
      >
        {/*icon*/}
        <Icon as={icon} boxSize={iconSize} color={textColor} />

        {/*content*/}
        <Text color={textColor} noOfLines={1}>
          {label}
        </Text>
      </HStack>
    </ChakraButton>
  );
};

export default ActionItem;
