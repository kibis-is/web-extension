import { HStack, Icon, Tooltip } from '@chakra-ui/react';
import React, { FC } from 'react';
import type { IconType } from 'react-icons';
import { BsUsbSymbol } from 'react-icons/bs';
import { IoBluetoothOutline, IoFingerPrintOutline } from 'react-icons/io5';
import { LuNfc } from 'react-icons/lu';

// constants
import { DEFAULT_GAP } from '@common/constants';

// hooks
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { IProps } from './types';

// utils
import calculateIconSize from '@common/utils/calculateIconSize';

const PasskeyCapabilities: FC<IProps> = ({ capabilities, size = 'sm' }) => {
  // hooks
  const subTextColor = useSubTextColor();
  // misc
  const iconSize = calculateIconSize(size);

  return (
    <HStack spacing={DEFAULT_GAP / 3}>
      {capabilities.map((value, index) => {
        let icon: IconType;
        let label: string;

        switch (value) {
          case 'ble':
            icon = IoBluetoothOutline;
            label = 'Bluetooth';
            break;
          case 'internal':
            icon = IoFingerPrintOutline;
            label = 'Internal';
            break;
          case 'nfc':
            icon = LuNfc;
            label = 'NFC';
            break;
          case 'usb':
            icon = BsUsbSymbol;
            label = 'USB';
            break;
          default:
            return null;
        }

        return (
          <Tooltip key={`passkey-capabilities-${index}`} label={label}>
            <span>
              <Icon as={icon} color={subTextColor} h={iconSize} w={iconSize} />
            </span>
          </Tooltip>
        );
      })}
    </HStack>
  );
};

export default PasskeyCapabilities;
