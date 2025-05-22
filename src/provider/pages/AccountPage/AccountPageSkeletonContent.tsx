import { Heading, HStack, Skeleton, Spacer, StackProps, VStack } from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import React, { type FC, useMemo } from 'react';

// components
import { NetworkSelectSkeleton } from '@provider/components/networks/NetworkSelect';
import { NativeBalanceSkeleton } from '@provider/components/accounts/NativeBalance';

// hooks
import useDefaultTextColor from '@provider/hooks/useDefaultTextColor';

// utils
import ellipseAddress from '@common/utils/ellipseAddress';

const AccountPageSkeletonContent: FC<StackProps> = (props) => {
  // memos
  const fakeAccount = useMemo(
    () =>
      ellipseAddress(faker.random.alphaNumeric(58).toUpperCase(), {
        end: 10,
        start: 10,
      }),
    []
  );
  // hooks
  const defaultTextColor = useDefaultTextColor();

  return (
    <VStack {...props}>
      <NetworkSelectSkeleton />

      <HStack alignItems="center" w="full">
        {/*name/address*/}
        <Skeleton>
          <Heading color={defaultTextColor} size="md" textAlign="left">
            {fakeAccount}
          </Heading>
        </Skeleton>

        <Spacer />

        {/*balance*/}
        <NativeBalanceSkeleton />
      </HStack>
    </VStack>
  );
};

export default AccountPageSkeletonContent;
