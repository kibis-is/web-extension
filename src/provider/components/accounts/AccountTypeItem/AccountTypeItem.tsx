import { Box, Icon, Text, Tooltip, VStack } from '@chakra-ui/react';
import React, { type FC, useMemo } from 'react';

// constants
import { DEFAULT_GAP } from '@common/constants';

// hooks
import useButtonHoverBackgroundColor from '@provider/hooks/useButtonHoverBackgroundColor';
import useBorderColor from '@provider/hooks/useBorderColor';
import useDefaultTextColor from '@provider/hooks/useDefaultTextColor';
import usePrimaryButtonHoverColor from '@provider/hooks/usePrimaryButtonHoverColor';
import usePrimaryButtonTextColor from '@provider/hooks/usePrimaryButtonTextColor';
import usePrimaryColor from '@provider/hooks/usePrimaryColor';

// types
import type { IProps } from './types';

// utils
import calculateIconSize from '@common/utils/calculateIconSize';

const AccountTypeItem: FC<IProps> = ({ description, icon, isDisabled = false, onClick, title, tooltipText }) => {
  // hooks
  const borderColor = useBorderColor();
  const buttonHoverBackgroundColor = useButtonHoverBackgroundColor();
  const defaultTextColor = useDefaultTextColor();
  const primaryButtonHoverColor = usePrimaryButtonHoverColor();
  const primaryButtonTextColor = usePrimaryButtonTextColor();
  const primaryColor = usePrimaryColor();
  // memos
  const width = useMemo(() => 32, []);
  const textColor = useMemo(
    () => (isDisabled ? defaultTextColor : primaryButtonTextColor),
    [defaultTextColor, isDisabled, primaryButtonTextColor]
  );
  //renders
  const renderContent = () => {
    return (
      <VStack align="center" justify="center" minH={width} spacing={DEFAULT_GAP / 3} w={width}>
        {/*icon*/}
        <Icon as={icon} color={textColor} boxSize={calculateIconSize('lg')} />

        {/*heading*/}
        <Text color={textColor} fontSize="sm" textAlign="center" w="full">
          {title}
        </Text>
      </VStack>
    );
  };

  if (isDisabled) {
    return (
      <Tooltip label={tooltipText || description}>
        <Box
          aria-label={description}
          as="button"
          bg={buttonHoverBackgroundColor}
          borderColor={borderColor}
          borderRadius="md"
          borderStyle="solid"
          borderWidth={1}
          cursor="not-allowed"
          opacity={0.5}
          p={DEFAULT_GAP - 2}
        >
          {renderContent()}
        </Box>
      </Tooltip>
    );
  }

  return (
    <Tooltip label={tooltipText || description}>
      <Box
        aria-label={description}
        as="button"
        _hover={{
          bg: primaryButtonHoverColor,
        }}
        backgroundColor={primaryColor}
        borderRadius="md"
        onClick={onClick}
        p={DEFAULT_GAP - 2}
        transitionDuration="var(--chakra-transition-duration-normal)"
        transitionProperty="var(--chakra-transition-property-common)"
      >
        {renderContent()}
      </Box>
    </Tooltip>
  );
};

export default AccountTypeItem;
