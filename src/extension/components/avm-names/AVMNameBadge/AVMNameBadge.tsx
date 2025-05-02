import { Tag, TagLabel } from '@chakra-ui/react';
import React, { type FC } from 'react';

// enums
import { AVMNameTypeEnum } from '@extension/enums';

// types
import type { TProps } from './types';

const AVMNameBadge: FC<TProps> = ({ colorMode, size = 'sm', type }) => {
  switch (type) {
    case AVMNameTypeEnum.EnVoi:
      return (
        <Tag
          colorScheme="blue"
          size={size}
          variant={colorMode === 'dark' ? 'solid' : 'subtle'}
        >
          <TagLabel>enVoi</TagLabel>
        </Tag>
      );
    default:
      return null;
  }
};

export default AVMNameBadge;
