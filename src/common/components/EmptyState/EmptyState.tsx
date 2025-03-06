import { ButtonProps, Heading, Icon, Text, VStack } from '@chakra-ui/react';
import React, { cloneElement, type FC, useMemo } from 'react';

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
  fontFamily,
  icon,
  text,
  ...stackProps
}) => {
  // hooks
  const defaultTextColor = useDefaultTextColor(colorMode);
  const subTextColor = useSubTextColor(colorMode);
  // memos
  const iconSize = useMemo(() => 20, []);
  // renders
  const renderButton = () => {
    let buttonProps: ButtonProps;

    if (button) {
      buttonProps = {
        fontFamily,
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
      spacing={DEFAULT_GAP - 2}
      w="full"
      {...stackProps}
    >
      {icon ? (
        <Icon as={icon} boxSize={iconSize} color={subTextColor} />
      ) : (
        <EmptyIcon boxSize={iconSize} colorMode={colorMode} />
      )}

      <VStack
        alignItems="center"
        justifyContent="center"
        spacing={DEFAULT_GAP / 3}
        w="full"
      >
        <Heading
          color={defaultTextColor}
          fontFamily={fontFamily}
          size="sm"
          m={0}
          p={0}
          textAlign="center"
        >
          {text}
        </Heading>

        {description && (
          <Text
            color={subTextColor}
            fontFamily={fontFamily}
            fontSize="sm"
            m={0}
            p={0}
            textAlign="center"
          >
            {description}
          </Text>
        )}
      </VStack>
      {renderButton()}
    </VStack>
  );
};

export default EmptyState;
