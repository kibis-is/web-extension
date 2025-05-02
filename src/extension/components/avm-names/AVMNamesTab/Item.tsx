import { HStack, Text, VStack } from '@chakra-ui/react';
import React, { type FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { IoEyeOutline } from 'react-icons/io5';

// components
import AVMNameBadge from '@extension/components/avm-names/AVMNameBadge';
import OverflowMenu from '@extension/components/OverflowMenu';

// constants
import { DEFAULT_GAP, TAB_ITEM_HEIGHT } from '@common/constants';

// enums
import { AVMNameTypeEnum } from '@extension/enums';

// hooks
import useBorderColor from '@extension/hooks/useBorderColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { TItemProps } from './types';

// utils
import formatID from '@extension/utils/formatID';

const Item: FC<TItemProps> = ({ colorMode, item, onViewClick }) => {
  const { t } = useTranslation();
  // hooks
  const borderColor = useBorderColor();
  const defaultTextColor = useDefaultTextColor();
  const subTextColor = useSubTextColor();
  // handlers
  const handleOnViewClick = useCallback(() => onViewClick(item.tokenId), []);

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
      <VStack
        alignItems="flex-start"
        flexGrow={1}
        h="full"
        justifyContent="space-evenly"
        spacing={1}
        w="full"
      >
        <Text color={defaultTextColor} fontSize="sm" maxW={175} noOfLines={1}>
          {item.metadata.name}
        </Text>

        <HStack
          alignItems="flex-start"
          justifyContent="space-between"
          spacing={1}
          w="full"
        >
          {/*token id*/}
          <Text color={subTextColor} fontSize="xs">
            {formatID(item.tokenId, true)}
          </Text>

          {/*type*/}
          <AVMNameBadge colorMode={colorMode} type={AVMNameTypeEnum.EnVoi} />
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
        ]}
      />
    </HStack>
  );
};

export default Item;
