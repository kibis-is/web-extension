import React, {
  type PropsWithoutRef,
  type ForwardRefExoticComponent,
  forwardRef,
  type LegacyRef,
  type RefAttributes,
} from 'react';
import { Button as ChakraButton } from '@chakra-ui/react';

// hooks
import usePrimaryButtonTextColor from '@external/hooks/usePrimaryButtonTextColor';
import usePrimaryColorScheme from '@external/hooks/usePrimaryColorScheme';

// theme
import { theme } from '@extension/theme';

// types
import type { IProps } from './types';

const Button: ForwardRefExoticComponent<
  PropsWithoutRef<IProps> & RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, IProps>(
  ({ colorMode, ...otherProps }: IProps, ref) => {
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
