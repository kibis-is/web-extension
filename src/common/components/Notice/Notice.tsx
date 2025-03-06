import { HStack, Icon, Text } from '@chakra-ui/react';
import React, { type FC, useMemo } from 'react';
import {
  IoAlertCircleOutline,
  IoInformationCircleOutline,
  IoWarningOutline,
} from 'react-icons/io5';

// constants
import { DEFAULT_GAP } from '@common/constants';

// types
import type { IProps } from './types';

const Notice: FC<IProps> = ({
  message,
  size = 'md',
  type = 'info',
  ...stackProps
}) => {
  // misc
  const backgroundColor = useMemo(() => {
    switch (type) {
      case 'error':
        return 'red.100';
      case 'warning':
        return 'orange.100';
      case 'info':
      default:
        return 'blue.100';
    }
  }, [type]);
  const borderColor = useMemo(() => {
    switch (type) {
      case 'error':
        return 'red.600';
      case 'warning':
        return 'orange.600';
      case 'info':
      default:
        return 'blue.600';
    }
  }, [type]);
  const icon = useMemo(() => {
    switch (type) {
      case 'error':
        return IoAlertCircleOutline;
      case 'warning':
        return IoWarningOutline;
      case 'info':
      default:
        return IoInformationCircleOutline;
    }
  }, [type]);
  let iconSize = useMemo(() => {
    switch (size) {
      case 'lg':
        return 10;
      case 'sm':
        return 6;
      case 'xs':
        return 3;
      case 'md':
      default:
        return 8;
    }
  }, [size]);

  return (
    <HStack
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      borderRadius="md"
      borderStyle="solid"
      borderWidth={1}
      px={DEFAULT_GAP / 3}
      py={1}
      spacing={DEFAULT_GAP / 3}
      {...stackProps}
    >
      {/*icon*/}
      <Icon as={icon} color={borderColor} h={iconSize} w={iconSize} />

      {/*message*/}
      <Text as="b" color={borderColor} fontSize={size} textAlign="left">
        {message}
      </Text>
    </HStack>
  );
};

export default Notice;
