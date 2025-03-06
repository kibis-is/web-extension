import {
  HStack,
  Skeleton,
  SkeletonCircle,
  Text,
  VStack,
} from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import React, { FC } from 'react';

// components
import PageHeader from '@extension/components/PageHeader';

// constants
import { DEFAULT_GAP } from '@common/constants';
import { PAGE_ITEM_HEIGHT } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

// selectors
import { useSelectSettingsColorMode } from '@extension/selectors';

const SkeletonAssetPage: FC = () => {
  // selectors
  const colorMode = useSelectSettingsColorMode();
  // hooks
  const defaultTextColor = useDefaultTextColor();

  return (
    <>
      <PageHeader
        colorMode={colorMode}
        loading={true}
        title={faker.random.alpha(12)}
      />

      <VStack
        alignItems="center"
        justifyContent="flex-start"
        p={DEFAULT_GAP - 2}
        spacing={DEFAULT_GAP}
        w="full"
      >
        <SkeletonCircle size="24" />

        {Array.from({ length: 3 }, (_, index) => (
          <HStack
            alignItems="center"
            h={PAGE_ITEM_HEIGHT}
            justifyContent="space-between"
            key={`skeleton-asset-page-item-${index}`}
            spacing={1}
            w="full"
          >
            <Skeleton>
              <Text color={defaultTextColor} fontSize="sm">
                {faker.random.alpha(12)}
              </Text>
            </Skeleton>

            <Skeleton>
              <Text color={defaultTextColor} fontSize="sm">
                {faker.random.alpha(32)}
              </Text>
            </Skeleton>
          </HStack>
        ))}
      </VStack>
    </>
  );
};

export default SkeletonAssetPage;
