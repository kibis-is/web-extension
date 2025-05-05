import { Box } from '@chakra-ui/react';
import React, { FC } from 'react';

// hooks
import useBorderColor from '@provider/hooks/useBorderColor';

const Divider: FC = () => (
  <Box borderTopColor={useBorderColor()} borderTopStyle="solid" borderTopWidth={1} m={0} w="full" />
);

export default Divider;
