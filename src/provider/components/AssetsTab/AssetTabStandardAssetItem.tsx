import { Button, HStack, Icon, Text, Tooltip, VStack } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React, { FC } from 'react';
import { IoChevronForward } from 'react-icons/io5';
import { Link } from 'react-router-dom';

// components
import AssetAvatar from '@provider/components/AssetAvatar';
import AssetBadge from '@provider/components/AssetBadge';
import AssetIcon from '@provider/components/icons/AssetIcon';

// constants
import { DEFAULT_GAP, TAB_ITEM_HEIGHT } from '@common/constants';
import { ASSETS_ROUTE } from '@provider/constants';

// enums
import { AssetTypeEnum } from '@provider/enums';

// hooks
import useButtonHoverBackgroundColor from '@provider/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@provider/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@provider/hooks/usePrimaryButtonTextColor';
import useSubTextColor from '@provider/hooks/useSubTextColor';

// types
import type { INetwork, IStandardAsset } from '@provider/types';

// utils
import convertToStandardUnit from '@common/utils/convertToStandardUnit';
import formatCurrencyUnit from '@common/utils/formatCurrencyUnit';

interface IProps {
  amount: string;
  network: INetwork;
  standardAsset: IStandardAsset;
}

const AssetTabStandardAssetItem: FC<IProps> = ({ amount, network, standardAsset }: IProps) => {
  // hooks
  const buttonHoverBackgroundColor: string = useButtonHoverBackgroundColor();
  const defaultTextColor: string = useDefaultTextColor();
  const primaryButtonTextColor: string = usePrimaryButtonTextColor();
  const subTextColor: string = useSubTextColor();
  // misc
  const standardUnitAmount: BigNumber = convertToStandardUnit(new BigNumber(amount), standardAsset.decimals);

  return (
    <Tooltip aria-label="Standard asset" label={standardAsset.name || standardAsset.id}>
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
        rightIcon={<Icon as={IoChevronForward} color={defaultTextColor} h={6} w={6} />}
        to={`${ASSETS_ROUTE}/${standardAsset.id}`}
        variant="ghost"
        w="full"
      >
        <HStack alignItems="center" m={0} p={0} spacing={2} w="full">
          {/*icon*/}
          <AssetAvatar
            asset={standardAsset}
            fallbackIcon={<AssetIcon color={primaryButtonTextColor} networkTheme={network.chakraTheme} h={6} w={6} />}
            size="sm"
          />

          {/*name/unit*/}
          {standardAsset.unitName ? (
            <VStack
              alignItems="flex-start"
              flexGrow={1}
              h="100%"
              justifyContent="space-between"
              spacing={DEFAULT_GAP / 3}
            >
              <Text color={defaultTextColor} fontSize="sm" maxW={175} noOfLines={1}>
                {standardAsset.name || standardAsset.id}
              </Text>

              <Text color={subTextColor} fontSize="xs">
                {standardAsset.unitName}
              </Text>
            </VStack>
          ) : (
            <Text color={defaultTextColor} flexGrow={1} fontSize="sm">
              {standardAsset.name || standardAsset.id}
            </Text>
          )}

          {/*amount*/}
          <VStack alignItems="flex-end" h="100%" justifyContent="space-between" spacing={DEFAULT_GAP / 3}>
            <Text color={defaultTextColor} fontSize="sm">
              {formatCurrencyUnit(standardUnitAmount, {
                decimals: standardAsset.decimals,
              })}
            </Text>

            <AssetBadge type={AssetTypeEnum.Standard} />
          </VStack>
        </HStack>
      </Button>
    </Tooltip>
  );
};

export default AssetTabStandardAssetItem;
