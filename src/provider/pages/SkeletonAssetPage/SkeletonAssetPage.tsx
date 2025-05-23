import { Heading, Skeleton, SkeletonCircle, Text, VStack } from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import React, { type FC, useMemo } from 'react';

// components
import PageHeader from '@provider/components/pages/PageHeader';

// constants
import { DEFAULT_GAP } from '@common/constants';

// hooks
import useDefaultTextColor from '@provider/hooks/useDefaultTextColor';

// selectors
import { useSelectSettingsColorMode } from '@provider/selectors';

const SkeletonAssetPage: FC = () => {
  // selectors
  const colorMode = useSelectSettingsColorMode();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  // memos
  const heading = useMemo(() => faker.random.alpha(12), []);
  const text = useMemo(() => faker.random.alpha(32), []);
  const title = useMemo(() => faker.random.alpha(12), []);

  return (
    <>
      <PageHeader colorMode={colorMode} loading={true} title={title} />

      <VStack alignItems="center" justifyContent="flex-start" p={DEFAULT_GAP - 2} spacing={DEFAULT_GAP} w="full">
        <SkeletonCircle size="24" />

        <Skeleton>
          <Heading color={defaultTextColor} size="lg">
            {heading}
          </Heading>
        </Skeleton>

        <Skeleton>
          <Text color={defaultTextColor} fontSize="sm">
            {text}
          </Text>
        </Skeleton>
      </VStack>
    </>
  );
};

export default SkeletonAssetPage;
