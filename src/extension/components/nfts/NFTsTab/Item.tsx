import { Button, HStack, Icon, Text, Tooltip, VStack } from '@chakra-ui/react';
import React, { type FC, useMemo } from 'react';
import { IoChevronForward } from 'react-icons/io5';
import { Link } from 'react-router-dom';

// components
import AssetBadge from '@extension/components/AssetBadge';
import AssetIcon from '@extension/components/icons/AssetIcon';
import NFTAvatar from '@extension/components/nfts/NFTAvatar';

// constants
import { DEFAULT_GAP, TAB_ITEM_HEIGHT } from '@common/constants';
import { NFTS_ROUTE } from '@extension/constants';

// enums
import { AssetTypeEnum } from '@extension/enums';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { IItemProps } from './types';

// utils
import formatID from '@extension/utils/formatID';

const Item: FC<IItemProps> = ({ item, network }) => {
  // hooks
  const buttonHoverBackgroundColor = useButtonHoverBackgroundColor();
  const defaultTextColor = useDefaultTextColor();
  const primaryButtonTextColor = usePrimaryButtonTextColor();
  const subTextColor = useSubTextColor();
  // memos
  const iconSize = useMemo(() => 6, []);

  return (
    <Tooltip label={item.metadata.name || item.tokenId}>
      <Button
        _hover={{
          bg: buttonHoverBackgroundColor,
        }}
        as={Link}
        borderRadius={0}
        fontSize="md"
        h={TAB_ITEM_HEIGHT}
        justifyContent="start"
        pl={3}
        pr={1}
        py={0}
        rightIcon={
          <Icon
            as={IoChevronForward}
            color={defaultTextColor}
            h={iconSize}
            w={iconSize}
          />
        }
        to={`${NFTS_ROUTE}/${item.id}/${item.tokenId}`}
        variant="ghost"
        w="full"
      >
        <HStack
          alignItems="center"
          m={0}
          p={0}
          spacing={DEFAULT_GAP / 3}
          w="full"
        >
          {/*icon*/}
          <NFTAvatar
            assetHolding={item}
            fallbackIcon={
              <AssetIcon
                color={primaryButtonTextColor}
                networkTheme={network.chakraTheme}
                h={iconSize}
                w={iconSize}
              />
            }
            size="sm"
          />

          {/*name/application id*/}
          {item.metadata.name ? (
            <VStack
              align="flex-start"
              flexGrow={1}
              h="100%"
              justify="space-between"
              spacing={DEFAULT_GAP / 3}
            >
              {/*name*/}
              <Text
                color={defaultTextColor}
                fontSize="sm"
                maxW={175}
                noOfLines={1}
              >
                {item.metadata.name}
              </Text>

              {/*application id*/}
              <Text color={subTextColor} fontSize="xs">
                {item.id}
              </Text>
            </VStack>
          ) : (
            // application id
            <Text color={defaultTextColor} flexGrow={1} fontSize="sm">
              {item.id}
            </Text>
          )}

          {/*token id/type*/}
          <VStack
            align="flex-end"
            h="100%"
            justify="space-between"
            spacing={DEFAULT_GAP / 3}
          >
            {/*token id*/}
            <Text color={defaultTextColor} fontSize="sm">
              {formatID(item.tokenId, true)}
            </Text>

            {/*type*/}
            <AssetBadge type={AssetTypeEnum.ARC0072} />
          </VStack>
        </HStack>
      </Button>
    </Tooltip>
  );
};

export default Item;
