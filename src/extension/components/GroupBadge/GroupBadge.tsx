import { Tag, TagLabel, TagLeftIcon, Tooltip } from '@chakra-ui/react';
import React, { type FC } from 'react';
import { IoFolderOutline } from 'react-icons/io5';

// types
import type { IProps } from './types';

const GroupBadge: FC<IProps> = ({ group, size = 'sm' }) => (
  <Tooltip label={group.name}>
    <Tag borderRadius="full" colorScheme="gray" size={size} variant="solid">
      <TagLeftIcon as={IoFolderOutline} />
      <TagLabel>{group.name}</TagLabel>
    </Tag>
  </Tooltip>
);

export default GroupBadge;
