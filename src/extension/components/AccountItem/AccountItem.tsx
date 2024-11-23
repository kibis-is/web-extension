import { Center, HStack, Text, VStack } from '@chakra-ui/react';
import React, { type FC } from 'react';

// components
import AccountAvatar from '@common/components/AccountAvatar';

// constants
import { DEFAULT_GAP } from '@common/constants';

// hooks
import useDefaultTextColor from '@common/hooks/useDefaultTextColor';
import useSubTextColor from '@common/hooks/useSubTextColor';

// types
import type { IProps } from './types';

// utils
import ellipseAddress from '@common/utils/ellipseAddress';
import convertPublicKeyToAVMAddress from '@common/utils/convertPublicKeyToAVMAddress';

const AccountItem: FC<IProps> = ({
  account,
  colorMode,
  subTextColor,
  textColor,
}) => {
  // hooks
  const defaultSubTextColor = useSubTextColor(colorMode);
  const defaultTextColor = useDefaultTextColor(colorMode);
  // misc
  const address = convertPublicKeyToAVMAddress(account.publicKey);

  return (
    <HStack m={0} p={0} spacing={DEFAULT_GAP / 3} w="full">
      {/*avatar*/}
      <Center>
        <AccountAvatar account={account} colorMode={colorMode} />
      </Center>

      {account.name ? (
        <VStack
          alignItems="flex-start"
          flexGrow={1}
          justifyContent="space-evenly"
          spacing={0}
        >
          <Text
            color={textColor || defaultTextColor}
            fontSize="sm"
            maxW={195}
            noOfLines={1}
            textAlign="left"
          >
            {account.name}
          </Text>

          <Text
            color={subTextColor || defaultSubTextColor}
            fontSize="xs"
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
          fontSize="sm"
          textAlign="left"
        >
          {ellipseAddress(address, {
            end: 10,
            start: 10,
          })}
        </Text>
      )}
    </HStack>
  );
};

export default AccountItem;
