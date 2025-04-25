import { Avatar, HStack, Icon, Text, VStack } from '@chakra-ui/react';
import React, { FC, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IoEyeOutline, IoTrashOutline } from 'react-icons/io5';

// components
import OverflowMenu from '@extension/components/OverflowMenu';

// constants
import { DEFAULT_GAP, TAB_ITEM_HEIGHT } from '@common/constants';
import { ASSETS_ROUTE } from '@extension/constants';

// hooks
import useBorderColor from '@extension/hooks/useBorderColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// icons
import KbPasskey from '@extension/icons/KbPasskey';

// types
import type { IItemProps } from './types';

// utils
import calculateIconSize from '@common/utils/calculateIconSize';
import formatTimestamp from '@common/utils/formatTimestamp';

const Item: FC<IItemProps> = ({ onRemoveClick, onViewClick, passkey }) => {
  const { t } = useTranslation();
  // hooks
  const borderColor = useBorderColor();
  const defaultTextColor = useDefaultTextColor();
  const subTextColor = useSubTextColor();
  // memos
  const iconSize = useMemo(() => calculateIconSize('sm'), []);
  // handlers
  const handleOnRemoveClick = useCallback(() => onRemoveClick(passkey.id), []);
  const handleOnViewClick = useCallback(() => onViewClick(passkey.id), []);

  return (
    <HStack
      align="center"
      borderBottomWidth={1}
      borderColor={borderColor}
      h={TAB_ITEM_HEIGHT}
      justify="space-between"
      m={0}
      px={DEFAULT_GAP / 2}
      py={DEFAULT_GAP / 3}
      spacing={DEFAULT_GAP / 3}
      w="full"
    >
      <Avatar
        size="sm"
        {...(passkey.iconURL
          ? {
              src: passkey.iconURL,
            }
          : {
              bg: 'green.500',
              icon: (
                <Icon as={KbPasskey} color="white" h={iconSize} w={iconSize} />
              ),
            })}
      />

      <VStack
        alignItems="flex-start"
        flexGrow={1}
        h="full"
        justifyContent="space-evenly"
        spacing={1}
      >
        <Text color={defaultTextColor} fontSize="sm" maxW={175} noOfLines={1}>
          {passkey.rp.name}
        </Text>

        <HStack
          alignItems="flex-start"
          justifyContent="space-between"
          spacing={1}
          w="full"
        >
          <Text color={subTextColor} fontSize="xs">
            {passkey.user.displayName}
          </Text>

          <Text color={subTextColor} fontSize="xs">
            {formatTimestamp(passkey.createdAt)}
          </Text>
        </HStack>
      </VStack>

      {/*overflow menu*/}
      <OverflowMenu
        items={[
          {
            icon: IoEyeOutline,
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
