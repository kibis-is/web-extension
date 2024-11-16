import type { ResponsiveValue } from '@chakra-ui/react';

// types
import type { IAccountGroup } from '@extension/types';

interface IProps {
  group: IAccountGroup;
  size?: ResponsiveValue<'size'>;
}

export default IProps;
