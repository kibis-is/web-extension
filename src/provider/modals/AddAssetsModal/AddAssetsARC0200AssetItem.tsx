import { Button, HStack, Icon, Tag, TagLabel, Text, Tooltip, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoChevronForward, IoCheckmarkCircleOutline } from 'react-icons/io5';

// components
import AssetAvatar from '@provider/components/AssetAvatar';
import AssetBadge from '@provider/components/AssetBadge';
import AssetIcon from '@provider/components/icons/AssetIcon';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP, TAB_ITEM_HEIGHT } from '@common/constants';

// enums
import { AssetTypeEnum } from '@provider/enums';

// hooks
import useButtonHoverBackgroundColor from '@provider/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@provider/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@provider/hooks/usePrimaryButtonTextColor';
import useSubTextColor from '@provider/hooks/useSubTextColor';

// selectors
import { useSelectSettingsColorMode } from '@provider/selectors';

// types
import type { IARC0200Asset } from '@provider/types';
import type { IItemProps } from './types';

const AddAssetsARC0200AssetItem: FC<IItemProps<IARC0200Asset>> = ({ added, asset, network, onClick }) => {
  const { t } = useTranslation();
  // selectors
  const colorMode = useSelectSettingsColorMode();
  // hooks
  const buttonHoverBackgroundColor = useButtonHoverBackgroundColor();
  const defaultTextColor = useDefaultTextColor();
  const primaryButtonTextColor = usePrimaryButtonTextColor();
  const subTextColor = useSubTextColor();
  // handlers
  const handleOnClick = () => {
    // if it is already added, just ignore
    if (added) {
      return;
    }

    onClick(asset);
  };
  // renders
  const renderAssetBadge = () => {
    const assetBadge = <AssetBadge type={AssetTypeEnum.ARC0200} />;

    if (!added) {
      return assetBadge;
    }

    return (
      <HStack spacing={1}>
        <Tag colorScheme="green" size="sm" variant={colorMode === 'dark' ? 'solid' : 'subtle'}>
          <TagLabel>{t('labels.alreadyAdded')}</TagLabel>
        </Tag>

        {assetBadge}
      </HStack>
    );
  };

  return (
    <Tooltip aria-label="ARC200 asset" label={asset.name}>
      <Button
        _hover={{
          bg: !added ? buttonHoverBackgroundColor : BODY_BACKGROUND_COLOR,
        }}
        borderRadius={0}
        cursor={!added ? 'pointer' : 'not-allowed'}
        fontSize="md"
        h={TAB_ITEM_HEIGHT}
        justifyContent="start"
        onClick={handleOnClick}
        px={DEFAULT_GAP / 2}
        py={DEFAULT_GAP / 2}
        rightIcon={
          !added ? (
            <Icon as={IoChevronForward} color={defaultTextColor} h={6} w={6} />
          ) : (
            <Icon as={IoCheckmarkCircleOutline} color="green.500" h={6} w={6} />
          )
        }
        variant="ghost"
        w="full"
      >
        <HStack alignItems="center" m={0} p={0} spacing={DEFAULT_GAP / 3} w="full">
          {/*icon*/}
          <AssetAvatar
            asset={asset}
            fallbackIcon={<AssetIcon color={primaryButtonTextColor} networkTheme={network.chakraTheme} h={6} w={6} />}
            size="sm"
          />

          <VStack alignItems="flex-start" flexGrow={1} h="100%" justifyContent="space-between" w="full">
            {/*name/id*/}
            <HStack alignItems="center" justifyContent="space-between" spacing={1} w="full">
              <Text color={!added ? defaultTextColor : subTextColor} fontSize="sm" maxW={175} noOfLines={1}>
                {asset.name}
              </Text>

              <Text color={subTextColor} fontSize="xs">
                {asset.id}
              </Text>
            </HStack>

            {/*symbol/type*/}
            <HStack alignItems="center" justifyContent="space-between" spacing={1} w="full">
              <Text color={subTextColor} fontSize="xs">
                {asset.symbol}
              </Text>

              {renderAssetBadge()}
            </HStack>
          </VStack>
        </HStack>
      </Button>
    </Tooltip>
  );
};

export default AddAssetsARC0200AssetItem;
