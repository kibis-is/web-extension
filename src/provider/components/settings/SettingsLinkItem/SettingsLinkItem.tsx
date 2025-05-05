import { Button, HStack, Icon, Tag, TagLabel, Text, VStack } from '@chakra-ui/react';
import { randomString } from '@stablelib/random';
import React, { FC, useMemo } from 'react';
import { IoChevronForward } from 'react-icons/io5';
import { Link } from 'react-router-dom';

// constants
import { DEFAULT_GAP } from '@common/constants';
import { SETTINGS_ITEM_HEIGHT } from '@provider/constants';

// hooks
import useButtonHoverBackgroundColor from '@provider/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@provider/hooks/useDefaultTextColor';

// types
import type { IProps } from './types';

const SettingsLinkItem: FC<IProps> = ({ badges, icon, label, to }) => {
  // hooks
  const buttonHoverBackgroundColor = useButtonHoverBackgroundColor();
  const defaultTextColor = useDefaultTextColor();
  // memos
  const context = useMemo(() => randomString(8), []);
  const iconSize = useMemo(() => 6, []);

  return (
    <Button
      _hover={{
        bg: buttonHoverBackgroundColor,
      }}
      as={Link}
      borderRadius={0}
      fontSize="md"
      h={SETTINGS_ITEM_HEIGHT}
      justifyContent="start"
      px={DEFAULT_GAP - 2}
      rightIcon={<Icon as={IoChevronForward} color={defaultTextColor} h={iconSize} w={iconSize} />}
      to={to}
      variant="ghost"
      w="full"
    >
      <HStack alignItems="center" justifyContent="flex-start" spacing={DEFAULT_GAP / 3} w="full">
        <Icon as={icon} color={defaultTextColor} h={iconSize} w={iconSize} />

        <VStack alignItems="flex-start" justifyContent="space-evenly" w="full">
          {/*label*/}
          <Text color={defaultTextColor} fontSize="md">
            {label}
          </Text>

          {/*badges*/}
          {badges && (
            <HStack w="full">
              {badges.map(({ colorScheme, label }, index) => (
                <Tag
                  borderRadius="full"
                  colorScheme={colorScheme}
                  key={`${context}-settings-link-badge-${index}`}
                  size="sm"
                  variant="solid"
                >
                  <TagLabel>{label}</TagLabel>
                </Tag>
              ))}
            </HStack>
          )}
        </VStack>
      </HStack>
    </Button>
  );
};

export default SettingsLinkItem;
