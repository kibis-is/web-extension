import { Heading, HStack, Text, Tooltip, VStack } from '@chakra-ui/react';
import React, { type FC, useCallback, useMemo } from 'react';

// constants
import { DEFAULT_GAP } from '@common/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// repositories
import AccountRepository from '@extension/repositories/AccountRepository';

// types
import type { IProps } from './types';

// utils
import convertPublicKeyToAVMAddress from '@common/utils/convertPublicKeyToAVMAddress';
import ellipseAddress from '@common/utils/ellipseAddress';

const AccountPageAddressDisplay: FC<IProps> = ({
  account,
  network,
  onEnVoiSelect,
}) => {
  // memos
  const accountInformation = useMemo(
    () =>
      AccountRepository.extractAccountInformationForNetwork(account, network),
    [account, network]
  );
  const address = useMemo(
    () => convertPublicKeyToAVMAddress(account.publicKey),
    [account]
  );
  const enVoiName = useMemo(
    () => accountInformation?.enVoi.primaryName || null,
    [accountInformation]
  );
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const subTextColor = useSubTextColor();
  // renders
  const renderContent = useCallback(() => {
    // if there is a name show the name and envoi
    if (account.name) {
      return (
        <>
          <HStack
            align="center"
            gap={DEFAULT_GAP / 3}
            justify="space-between"
            w="full"
          >
            {/*name*/}
            <Tooltip label={account.name}>
              <Heading
                color={defaultTextColor}
                maxW="650px" // full address length
                noOfLines={1}
                size="md"
                textAlign="left"
              >
                {account.name}
              </Heading>
            </Tooltip>

            {/*envoi*/}
            {accountInformation && enVoiName && (
              <Text color={subTextColor}>{enVoiName}</Text>
            )}
          </HStack>

          {/*address*/}
          <Tooltip label={address}>
            <Text color={subTextColor} fontSize="xs" textAlign="left" w="full">
              {ellipseAddress(address, { end: 15, start: 15 })}
            </Text>
          </Tooltip>
        </>
      );
    }

    // if there is no name, but there is an envoi, display the envoi
    if (accountInformation && enVoiName) {
      return (
        <>
          {/*envoi*/}
          <Text color={subTextColor} fontSize="lg">
            {enVoiName}
          </Text>

          {/*address*/}
          <Tooltip label={address}>
            <Text
              color={subTextColor}
              fontSize="xs"
              pl={DEFAULT_GAP / 3}
              textAlign="left"
              w="full"
            >
              {ellipseAddress(address, { end: 15, start: 15 })}
            </Text>
          </Tooltip>
        </>
      );
    }

    // if there is no name or envoi, display the address
    return (
      <Tooltip label={ellipseAddress(address, { end: 15, start: 15 })}>
        <Heading
          color={defaultTextColor}
          maxW="650px" // full address length
          noOfLines={1}
          size="md"
          textAlign="left"
        >
          {address}
        </Heading>
      </Tooltip>
    );
  }, [account, accountInformation, enVoiName]);

  return (
    <VStack alignItems="flex-start" spacing={DEFAULT_GAP / 3} w="full">
      {renderContent()}
    </VStack>
  );
};

export default AccountPageAddressDisplay;
