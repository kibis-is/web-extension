import { Box } from '@chakra-ui/react';
import React, { FC } from 'react';

const SideBarDivider: FC = () => (
  <Box
    borderTopColor="gray.300"
    borderTopStyle="solid"
    borderTopWidth={1}
    m={0}
    w="full"
  />
);

export default SideBarDivider;