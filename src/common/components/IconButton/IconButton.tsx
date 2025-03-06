import { Icon, IconButton as ChakraIconButton } from '@chakra-ui/react';
import React, {
  type PropsWithoutRef,
  type ForwardRefExoticComponent,
  forwardRef,
  type LegacyRef,
  type RefAttributes,
} from 'react';

// hooks
import useButtonHoverBackgroundColor from '@common/hooks/useButtonHoverBackgroundColor';
import useSubTextColor from '@common/hooks/useSubTextColor';

// types
import type { TProps } from './types';

const IconButton: ForwardRefExoticComponent<
  PropsWithoutRef<TProps> & RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, TProps>(
  ({ color, colorMode, icon, ...iconProps }, ref) => {
    // hooks
    const buttonHoverBackgroundColor = useButtonHoverBackgroundColor(colorMode);
    const subTextColor = useSubTextColor(colorMode);

    return (
      <ChakraIconButton
        {...iconProps}
        _active={{
          bg: buttonHoverBackgroundColor,
        }}
        _hover={{
          bg: buttonHoverBackgroundColor,
        }}
        icon={<Icon as={icon} color={color || subTextColor} />}
        ref={ref as LegacyRef<HTMLButtonElement>}
      />
    );
  }
);

IconButton.displayName = 'IconButton';

export default IconButton;
