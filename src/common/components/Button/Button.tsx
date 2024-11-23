import React, {
  type PropsWithoutRef,
  type ForwardRefExoticComponent,
  forwardRef,
  type LegacyRef,
  type RefAttributes,
} from 'react';
import { Button as ChakraButton } from '@chakra-ui/react';

// hooks
import usePrimaryButtonTextColor from '@common/hooks/usePrimaryButtonTextColor';
import usePrimaryColorScheme from '@common/hooks/usePrimaryColorScheme';

// theme
import { theme } from '@common/theme';

// types
import type { TProps } from './types';

const Button: ForwardRefExoticComponent<
  PropsWithoutRef<TProps> & RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, TProps>(
  ({ colorMode, ...otherProps }, ref) => {
    // hooks
    const primaryButtonTextColor = usePrimaryButtonTextColor(colorMode);
    const primaryColorScheme = usePrimaryColorScheme(colorMode);

    return (
      <ChakraButton
        color={
          otherProps.variant !== 'outline'
            ? primaryButtonTextColor
            : otherProps.color
        }
        colorScheme={primaryColorScheme}
        {...otherProps}
        borderRadius={theme.radii['3xl']}
        ref={ref as LegacyRef<HTMLButtonElement>}
      />
    );
  }
);

Button.displayName = 'Button';

export default Button;
