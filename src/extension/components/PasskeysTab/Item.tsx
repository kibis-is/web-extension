import { Avatar, HStack, Icon, Text, VStack } from '@chakra-ui/react';
import React, { FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { IoLockOpenOutline, IoTrashOutline } from 'react-icons/io5';

// components
import OverflowMenu from '@extension/components/OverflowMenu';

// constants
import { DEFAULT_GAP, TAB_ITEM_HEIGHT } from '@common/constants';
import { ASSETS_ROUTE } from '@extension/constants';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// icons
import KbPasskey from '@extension/icons/KbPasskey';

// types
import type { IItemProps } from './types';

const Item: FC<IItemProps> = ({ onRemoveClick, onViewClick, passkey }) => {
  const { t } = useTranslation();
  // hooks
  const buttonHoverBackgroundColor: string = useButtonHoverBackgroundColor();
  const defaultTextColor: string = useDefaultTextColor();
  const primaryButtonTextColor: string = usePrimaryButtonTextColor();
  const subTextColor: string = useSubTextColor();
  // handlers
  const handleOnRemoveClick = useCallback(() => onRemoveClick(), []);
  const handleOnViewClick = useCallback(() => onViewClick(), []);

  return (
    <HStack
      align="center"
      h={TAB_ITEM_HEIGHT}
      justify="space-between"
      m={0}
      p={0}
      spacing={DEFAULT_GAP / 3}
      w="full"
    >
      <Avatar
        bg="green.500"
        icon={<Icon as={KbPasskey} color="green.700" />}
        size="sm"
      />

      <VStack flexGrow={1} w="full"></VStack>

      {/*overflow menu*/}
      <OverflowMenu
        items={[
          {
            icon: IoLockOpenOutline,
            label: t<string>('buttons.view'),
            onSelect: handleOnViewClick,
          },
          {
            icon: IoTrashOutline,
            label: t<string>('buttons.remove'),
            onSelect: handleOnRemoveClick,
          },
        ]}
      />
    </HStack>
  );
};

export default Item;
