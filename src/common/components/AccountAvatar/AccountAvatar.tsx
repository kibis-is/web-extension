import { Avatar } from '@chakra-ui/react';
import React, { type FC } from 'react';

// hooks
import usePrimaryButtonTextColor from '@common/hooks/usePrimaryButtonTextColor';
import usePrimaryColor from '@common/hooks/usePrimaryColor';

// types
import type { TProps } from './types';

// utils
import parseAccountIcon from '@common/utils/parseAccountIcon';

const AccountAvatar: FC<TProps> = ({ account, children, colorMode }) => {
  // hooks
  const primaryButtonTextColor = usePrimaryButtonTextColor(colorMode);
  const primaryColor = usePrimaryColor(colorMode);
  // misc
  let iconColor = primaryButtonTextColor;

  switch (account.color) {
    case 'yellow.300':
    case 'yellow.500':
    case 'orange.300':
    case 'orange.500':
    case 'red.300':
    case 'red.500':
      iconColor = 'gray.800';
      break;
    case 'black':
    case 'blue.300':
    case 'blue.500':
    case 'green.300':
    case 'green.500':
    case 'teal.300':
    case 'teal.500':
      iconColor = 'white';
      break;
    case 'primary':
    default:
      break;
  }

  return (
    <Avatar
      bg={
        !account.color || account.color === 'primary'
          ? primaryColor
          : account.color
      }
      icon={parseAccountIcon({
        accountIcon: account.icon || null,
        color: iconColor,
      })}
      size="sm"
    >
      {children}
    </Avatar>
  );
};

export default AccountAvatar;
