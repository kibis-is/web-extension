import { HStack, Text } from '@chakra-ui/react';
import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';

// hooks
import useDefaultTextColor from '@common/hooks/useDefaultTextColor';

// types
import type { TProps } from './types';

const Label: FC<TProps> = ({
  colorMode,
  error,
  fontFamily,
  inputID,
  label,
  required = false,
  ...stackProps
}) => {
  const { t } = useTranslation();
  // hooks
  const defaultTextColor = useDefaultTextColor(colorMode);

  return (
    <HStack
      alignItems="flex-end"
      justifyContent="space-between"
      w="full"
      {...stackProps}
    >
      {/*label*/}
      {required ? (
        <HStack alignItems="center" spacing={1}>
          <Text
            as={'label'}
            color={error ? 'red.300' : defaultTextColor}
            fontFamily={fontFamily}
            fontSize="xs"
            htmlFor={inputID}
            m={0}
            p={0}
            textAlign="left"
          >
            {label}
          </Text>

          {/*required asterisk*/}
          <Text
            as={'span'}
            color="red.300"
            fontFamily={fontFamily}
            fontSize="xs"
            m={0}
            p={0}
            textAlign="left"
          >
            {`*`}
          </Text>
        </HStack>
      ) : (
        <Text
          as={'label'}
          color={error ? 'red.300' : defaultTextColor}
          fontFamily={fontFamily}
          fontSize="xs"
          htmlFor={inputID}
          m={0}
          p={0}
          textAlign="left"
        >
          {`${label} ${t<string>('labels.optional')}`}
        </Text>
      )}

      {/*error*/}
      {error && (
        <Text
          color="red.300"
          fontFamily={fontFamily}
          fontSize="xs"
          m={0}
          p={0}
          textAlign="right"
        >
          {error}
        </Text>
      )}
    </HStack>
  );
};

export default Label;
