import { Skeleton, Text, VStack } from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import React, { FC } from 'react';

// constants
import { DEFAULT_GAP } from '@common/constants';

const LoadingTransactionPage: FC = () => (
  <VStack
    alignItems="flex-start"
    justifyContent="flex-start"
    px={DEFAULT_GAP}
    spacing={4}
    w="full"
  >
    {Array.from({ length: 3 }, (_, index) => (
      <Skeleton key={`loading-transaction-item-${index}`} w="full">
        <Text fontSize="sm" w="full">
          {faker.random.alphaNumeric(10)}
        </Text>
      </Skeleton>
    ))}
  </VStack>
);

export default LoadingTransactionPage;
