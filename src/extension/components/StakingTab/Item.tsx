import {
  Avatar,
  AvatarBadge,
  Button,
  Center,
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
import { IoChevronForward, IoFlagOutline } from 'react-icons/io5';

// constants
import {
  BODY_BACKGROUND_COLOR,
  DEFAULT_GAP,
  TAB_ITEM_HEIGHT,
} from '@extension/constants';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useDefaultAvatarBackgroundColor from '@extension/hooks/useDefaultAvatarBackgroundColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';
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
  const buttonHoverBackgroundColor = useButtonHoverBackgroundColor();
  const defaultAvatarBackgroundColor = useDefaultAvatarBackgroundColor();
  const defaultTextColor = useDefaultTextColor();
  const primaryColorScheme = usePrimaryColorScheme();
  const subTextColor = useSubTextColor();
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
      variant="ghost"
      w="full"
    >
      <HStack align="center" m={0} p={0} spacing={DEFAULT_GAP / 3} w="full">
        <Avatar
          bg={defaultAvatarBackgroundColor}
          icon={
            <Icon
              as={IoFlagOutline}
              color="white"
              boxSize={calculateIconSize('sm')}
            />
          }
          size="sm"
        >
          <AvatarBadge
            bg={app.status === 'online' ? 'green.500' : 'red.300'}
            borderColor={BODY_BACKGROUND_COLOR}
            borderWidth={1}
            boxSize="1em"
            placement="bottom-end"
          />
        </Avatar>

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

        {/*balance/badges*/}
        <VStack
          align="flex-end"
          flexGrow={1}
          h="100%"
          justify="space-between"
          spacing={DEFAULT_GAP / 3}
        >
          {/*total balance*/}
          <HStack align="center" h="100%" justify="center" spacing={1}>
            <Text color={defaultTextColor} fontSize="sm">
              {formatCurrencyUnit(balanceAsStandardUnit, {
                decimals: balanceAsStandardUnit.gt(1)
                  ? 2
                  : network.nativeCurrency.decimals,
              })}
            </Text>

            {createIconFromDataUri(network.nativeCurrency.iconUrl, {
              color: defaultTextColor,
              boxSize: calculateIconSize('xs'),
            })}
          </HStack>

          {/*phase badge*/}
          {app.phase >= 0 && (
            <Tag
              colorScheme={primaryColorScheme}
              size="sm"
              variant={colorMode === 'dark' ? 'solid' : 'subtle'}
            >
              <TagLabel>
                {t<string>('labels.stakingPhase', { number: app.phase + 1 })}
              </TagLabel>
            </Tag>
          )}
        </VStack>
      </HStack>
    </Button>
  );
};

export default Item;
