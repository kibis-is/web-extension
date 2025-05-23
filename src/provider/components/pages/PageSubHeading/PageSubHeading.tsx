import { Text } from '@chakra-ui/react';
import React, { FC } from 'react';

// constants
import { DEFAULT_GAP } from '@common/constants';
import { PAGE_ITEM_HEIGHT } from '@provider/constants';

// hooks
import useSubTextColor from '@provider/hooks/useSubTextColor';

// types
import { IProps } from './types';

const PageSubHeading: FC<IProps> = ({ color, fontSize = 'md', text }) => {
  // hooks
  const subTextColor = useSubTextColor();

  return (
    <Text
      as="b"
      color={color || subTextColor}
      fontSize={fontSize}
      minH={PAGE_ITEM_HEIGHT}
      pb={DEFAULT_GAP / 3}
      textAlign="left"
      w="full"
    >
      {text}
    </Text>
  );
};

export default PageSubHeading;
