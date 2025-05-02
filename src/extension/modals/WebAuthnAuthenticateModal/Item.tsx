import {
  Avatar,
  Button as ChakraButton,
  HStack,
  Icon,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import React, { type FC, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IoChevronForward } from 'react-icons/io5';

// constants
import { DEFAULT_GAP, TAB_ITEM_HEIGHT } from '@common/constants';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// icons
import KbPasskey from '@extension/icons/KbPasskey';

// types
import type { IItemProps } from './types';

// utils
import calculateIconSize from '@common/utils/calculateIconSize';
import formatTimestamp from '@common/utils/formatTimestamp';

const Item: FC<IItemProps> = ({ disabled = false, onClick, passkey }) => {
  const { t } = useTranslation();
  // hooks
  const buttonHoverBackgroundColor = useButtonHoverBackgroundColor();
  const defaultTextColor = useDefaultTextColor();
  const subTextColor = useSubTextColor();
  // memos
  const iconSize = useMemo(() => calculateIconSize('sm'), []);
  // handlers
  const handleOnClick = useCallback(
    () => onClick(passkey.id),
    [passkey, onClick]
  );
  // renders
  const renderContent = () => (
    <HStack
      align="center"
      h="full"
      justify="space-between"
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
    </HStack>
  );

  return (
    <ChakraButton
      _hover={{
        bg: 'transparent',
      }}
      alignItems="center"
      backgroundColor="transparent"
      borderRadius="full"
      cursor="not-allowed"
      h={TAB_ITEM_HEIGHT}
      justifyContent="space-between"
      m={0}
      opacity={0.6}
      px={DEFAULT_GAP / 2}
      py={DEFAULT_GAP / 3}
      rightIcon={
        <Icon as={IoChevronForward} boxSize={iconSize} color={subTextColor} />
      }
      variant="ghost"
      w="full"
      {...(!disabled && {
        _hover: {
          bg: buttonHoverBackgroundColor,
        },
        cursor: 'pointer',
        onClick: handleOnClick,
        opacity: 1,
      })}
    >
      {!disabled ? (
        renderContent()
      ) : (
        <Tooltip label={t<string>('captions.passkeyNotRequested')}>
          {renderContent()}
        </Tooltip>
      )}
    </ChakraButton>
  );
};

export default Item;
