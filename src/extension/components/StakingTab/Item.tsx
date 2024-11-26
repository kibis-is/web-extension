import {
  Button,
  HStack,
  Icon,
  Tag,
  TagLabel,
  Text,
  VStack,
} from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React, { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IoChevronForward } from 'react-icons/io5';
import { Link } from 'react-router-dom';

// constants
import { DEFAULT_GAP, TAB_ITEM_HEIGHT } from '@extension/constants';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { IItemProps } from './types';

// utils
import calculateIconSize from '@extension/utils/calculateIconSize';
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import convertToStandardUnit from '@common/utils/convertToStandardUnit';
import createIconFromDataUri from '@extension/utils/createIconFromDataUri';
import ellipseAddress from '@extension/utils/ellipseAddress';
import formatCurrencyUnit from '@common/utils/formatCurrencyUnit';

const Item: FC<IItemProps> = ({ app, colorMode, network }) => {
  const { t } = useTranslation();
  // hooks
  const buttonHoverBackgroundColor: string = useButtonHoverBackgroundColor();
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  // misc
  const balanceAsStandardUnit = useMemo(
    () =>
      convertToStandardUnit(
        new BigNumber(app.balance),
        network.nativeCurrency.decimals
      ),
    [app, network]
  );

  return (
    <Button
      _hover={{
        bg: buttonHoverBackgroundColor,
      }}
      as={Link}
      borderRadius={0}
      fontSize="md"
      h={TAB_ITEM_HEIGHT}
      justifyContent="start"
      pl={DEFAULT_GAP / 2}
      pr={1}
      py={0}
      rightIcon={
        <Icon
          as={IoChevronForward}
          boxSize={calculateIconSize('md')}
          color={defaultTextColor}
        />
      }
      // to={`${ASSETS_ROUTE}/${arc0200Asset.id}`}
      variant="ghost"
      w="full"
    >
      <HStack align="center" m={0} p={0} spacing={DEFAULT_GAP / 3} w="full">
        {/*id/address*/}
        <VStack
          align="flex-start"
          flexGrow={1}
          h="100%"
          justify="space-between"
          spacing={DEFAULT_GAP / 3}
        >
          <Text
            color={defaultTextColor}
            fontSize="sm"
            textAlign="left"
            w="full"
          >
            {ellipseAddress(convertPublicKeyToAVMAddress(app.publicKey), {
              end: 8,
              start: 8,
            })}
          </Text>

          <Text color={subTextColor} fontSize="xs" textAlign="left" w="full">
            {app.appID}
          </Text>
        </VStack>

        {/*total balance*/}
        <HStack align="center" h="100%" justify="center" spacing={1}>
          <Text color={defaultTextColor} fontSize="sm">
            {formatCurrencyUnit(balanceAsStandardUnit, {
              decimals: network.nativeCurrency.decimals,
            })}
          </Text>

          {createIconFromDataUri(network.nativeCurrency.iconUrl, {
            color: defaultTextColor,
            boxSize: calculateIconSize('xs'),
          })}

          {/*phase*/}
          {app.phase >= 0 && (
            <Tag
              colorScheme="primary"
              size="sm"
              variant={colorMode === 'dark' ? 'solid' : 'subtle'}
            >
              <TagLabel>
                {t<string>('labels.stakingPhase', { number: app.phase + 1 })}
              </TagLabel>
            </Tag>
          )}
        </HStack>
      </HStack>
    </Button>
  );
};

export default Item;
