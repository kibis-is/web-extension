import { Box, HStack, Text } from '@chakra-ui/react';
import React, { FC } from 'react';

// constants
import { DEFAULT_GAP } from '@common/constants';
import { PAGE_ITEM_HEIGHT } from '@provider/constants';

// hooks
import useDefaultTextColor from '@provider/hooks/useDefaultTextColor';

// types
import type { IProps } from './types';

const PageItem: FC<IProps> = ({ children, fontSize = 'sm', label, ...stackProps }) => {
  // hooks
  const defaultTextColor = useDefaultTextColor();

  return (
    <HStack
      alignItems="center"
      justifyContent="space-between"
      minH={PAGE_ITEM_HEIGHT}
      spacing={DEFAULT_GAP / 3}
      w="full"
      {...stackProps}
    >
      {/*label*/}
      <Text color={defaultTextColor} fontSize={fontSize}>
        {`${label}:`}
      </Text>

      {/*value*/}
      <Box>{children}</Box>
    </HStack>
  );
};

export default PageItem;
