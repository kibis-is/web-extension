import { Button, Icon, Link, Text } from '@chakra-ui/react';
import React, { type FC, useMemo } from 'react';
import { IoOpenOutline } from 'react-icons/io5';

// constants
import { DEFAULT_GAP } from '@common/constants';
import { SETTINGS_ITEM_HEIGHT } from '@provider/constants';

// hooks
import useButtonHoverBackgroundColor from '@provider/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@provider/hooks/useDefaultTextColor';

// types
import type { IProps } from './types';

const SettingsExternalLinkItem: FC<IProps> = ({ label, to }) => {
  // hooks
  const buttonHoverBackgroundColor = useButtonHoverBackgroundColor();
  const defaultTextColor = useDefaultTextColor();
  // memos
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
      isExternal={true}
      justifyContent="start"
      px={DEFAULT_GAP - 2}
      rightIcon={<Icon as={IoOpenOutline} color={defaultTextColor} h={iconSize} w={iconSize} />}
      href={to}
      variant="ghost"
      w="full"
    >
      <Text color={defaultTextColor} fontSize="md" w="full">
        {label}
      </Text>
    </Button>
  );
};

export default SettingsExternalLinkItem;
