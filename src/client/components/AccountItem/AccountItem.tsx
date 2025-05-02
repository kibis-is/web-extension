import { Center, HStack, Icon, Text, VStack } from '@chakra-ui/react';
import React, { type FC, useMemo } from 'react';

// components
import AccountAvatar from '@common/components/AccountAvatar';

// constants
import { DEFAULT_GAP } from '@common/constants';
import { EXTERNAL_INPUT_HEIGHT } from '@client/constants';

// hooks
import useBorderColor from '@common/hooks/useBorderColor';
import useDefaultTextColor from '@common/hooks/useDefaultTextColor';
import useSubTextColor from '@common/hooks/useSubTextColor';

// icons
import KbPasskey from '@extension/icons/KbPasskey';

// types
import type { IProps } from './types';

// utils
import calculateIconSize from '@common/utils/calculateIconSize';
import convertPublicKeyToAVMAddress from '@common/utils/convertPublicKeyToAVMAddress';
import ellipseAddress from '@common/utils/ellipseAddress';

const AccountItem: FC<IProps> = ({
  account,
  colorMode,
  fontFamily,
  subTextColor,
  textColor,
}) => {
  // hooks
  const borderColor = useBorderColor(colorMode);
  const defaultSubTextColor = useSubTextColor(colorMode);
  const defaultTextColor = useDefaultTextColor(colorMode);
  // misc
  const address = useMemo(
    () => convertPublicKeyToAVMAddress(account.publicKey),
    [account]
  );

  return (
    <HStack
      borderColor={borderColor}
      borderStyle="solid"
      borderRadius="full"
      borderWidth="1px"
      m={0}
      px={DEFAULT_GAP / 2}
      py={DEFAULT_GAP / 3}
      spacing={DEFAULT_GAP / 3}
      w="full"
    >
      {/*avatar*/}
      <Center>
        <AccountAvatar
          account={account}
          colorMode={colorMode}
          fontFamily={fontFamily}
          size="xs"
        />
      </Center>

      {/*name/address*/}
      {account.name ? (
        <VStack
          align="flex-start"
          flexGrow={1}
          h={EXTERNAL_INPUT_HEIGHT}
          justify="space-evenly"
          spacing={0}
        >
          <Text
            color={textColor || defaultTextColor}
            fontFamily={fontFamily}
            fontSize="xs"
            maxW={195}
            noOfLines={1}
            m={0}
            p={0}
            textAlign="left"
          >
            {account.name}
          </Text>

          <Text
            color={subTextColor || defaultSubTextColor}
            fontFamily={fontFamily}
            fontSize="xx-small"
            m={0}
            p={0}
            textAlign="left"
          >
            {ellipseAddress(address, {
              end: 10,
              start: 10,
            })}
          </Text>
        </VStack>
      ) : (
        <Text
          color={textColor || defaultTextColor}
          flexGrow={1}
          fontFamily={fontFamily}
          fontSize="xs"
          m={0}
          p={0}
          textAlign="left"
        >
          {ellipseAddress(address, {
            end: 10,
            start: 10,
          })}
        </Text>
      )}

      {/*icon*/}
      <Icon as={KbPasskey} boxSize={calculateIconSize()} color={subTextColor} />
    </HStack>
  );
};

export default AccountItem;
