import { ButtonProps, Heading, Text, VStack } from '@chakra-ui/react';
import React, { type FC } from 'react';

// components
import Button from '@common/components/Button';
import EmptyIcon from '@common/components/EmptyIcon';

// constants
import { DEFAULT_GAP } from '@common/constants';

// hooks
import useDefaultTextColor from '@common/hooks/useDefaultTextColor';
import useSubTextColor from '@common/hooks/useSubTextColor';

// types
import type { TProps } from './types';

const EmptyState: FC<TProps> = ({
  button,
  colorMode,
  description,
  text,
  ...stackProps
}) => {
  // hooks
  const defaultTextColor = useDefaultTextColor(colorMode);
  const subTextColor = useSubTextColor(colorMode);
  // renders
  const renderButton = () => {
    let buttonProps: ButtonProps;

    if (button) {
      buttonProps = {
        onClick: button.onClick,
        ...(button.colorScheme && {
          colorScheme: button.colorScheme,
        }),
        ...(button.icon && {
          rightIcon: <button.icon />,
        }),
      };

      return (
        <Button colorMode={colorMode} {...buttonProps}>
          {button.label}
        </Button>
      );
    }

    return null;
  };

  return (
    <VStack
      alignItems="center"
      justifyContent="center"
      p={DEFAULT_GAP - 2}
      spacing={DEFAULT_GAP / 3}
      w="full"
      {...stackProps}
    >
      <EmptyIcon boxSize={20} colorMode={colorMode} />

      <Heading color={defaultTextColor} textAlign="center">
        {text}
      </Heading>

      {description && (
        <Text color={subTextColor} fontSize="sm" textAlign="center">
          {description}
        </Text>
      )}
      {renderButton()}
    </VStack>
  );
};

export default EmptyState;
