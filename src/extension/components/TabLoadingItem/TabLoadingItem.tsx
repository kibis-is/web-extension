import { HStack, Skeleton, SkeletonCircle, Text } from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import React, { type FC, useMemo } from 'react';

// constants
import { DEFAULT_GAP, TAB_ITEM_HEIGHT } from '@common/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

const TabLoadingItem: FC = () => {
  // hooks
  const defaultTextColor = useDefaultTextColor();
  // memo
  const text = useMemo(() => faker.company.bsBuzz(), []);

  return (
    <HStack
      h={TAB_ITEM_HEIGHT}
      m={0}
      pl={DEFAULT_GAP / 2}
      pr={1}
      py={0}
      spacing={DEFAULT_GAP / 3}
      w="full"
    >
      <SkeletonCircle size="9" />

      <Skeleton flexGrow={1}>
        <Text color={defaultTextColor} fontSize="md" w="full">
          {text}
        </Text>
      </Skeleton>
    </HStack>
  );
};

export default TabLoadingItem;
