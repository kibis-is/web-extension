import { Center, HStack, Text, VStack } from '@chakra-ui/react';
import React, { type FC, useCallback, useMemo } from 'react';

// components
import AccountAvatar from '@common/components/AccountAvatar';

// constants
import { DEFAULT_GAP } from '@common/constants';

// hooks
import useDefaultTextColor from '@common/hooks/useDefaultTextColor';
import useSubTextColor from '@common/hooks/useSubTextColor';

// repositories
import AccountRepository from '@extension/repositories/AccountRepository';

// types
import type { TProps } from './types';

// utils
import convertPublicKeyToAVMAddress from '@common/utils/convertPublicKeyToAVMAddress';
import ellipseAddress from '@common/utils/ellipseAddress';

const AccountItem: FC<TProps> = ({
  account,
  colorMode,
  network,
  subTextColor,
  textColor,
}) => {
  // hooks
  const defaultSubTextColor = useSubTextColor(colorMode);
  const defaultTextColor = useDefaultTextColor(colorMode);
  // memos
  const accountInformation = useMemo(
    () =>
      AccountRepository.extractAccountInformationForNetwork(account, network),
    [account, network]
  );
  const address = useMemo(
    () =>
      ellipseAddress(convertPublicKeyToAVMAddress(account.publicKey), {
        end: 10,
        start: 10,
      }),
    [account]
  );
  const enVoiName = useMemo(
    () => accountInformation?.enVoi.primaryName || null,
    [accountInformation]
  );
  // renders
  const renderNameAddress = useCallback(() => {
    if (account.name) {
      return (
        <VStack
          alignItems="flex-start"
          flexGrow={1}
          justifyContent="space-evenly"
          spacing={0}
        >
          <Text
            color={defaultTextColor}
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
            {enVoiName ?? address}
          </Text>
        </VStack>
      );
    }

    // if there is no name, but there is an envoi, display the envoi
    if (enVoiName) {
      return (
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
            {enVoiName}
          </Text>

          <Text
            color={subTextColor || defaultSubTextColor}
            fontSize="xs"
            textAlign="left"
          >
            {address}
          </Text>
        </VStack>
      );
    }

    return (
      <Text
        color={textColor || defaultTextColor}
        flexGrow={1}
        fontSize="sm"
        textAlign="left"
      >
        {address}
      </Text>
    );
  }, [
    account,
    address,
    defaultSubTextColor,
    defaultTextColor,
    enVoiName,
    subTextColor,
    textColor,
  ]);

  return (
    <HStack m={0} p={0} spacing={DEFAULT_GAP / 3} w="full">
      {/*avatar*/}
      <Center>
        <AccountAvatar account={account} colorMode={colorMode} />
      </Center>

      {renderNameAddress()}
    </HStack>
  );
};

export default AccountItem;
