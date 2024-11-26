import type { ColorMode } from '@chakra-ui/react';

// types
import type { IAccountWithExtendedProps, INetwork } from '@extension/types';

interface IProps {
  account: IAccountWithExtendedProps;
  colorMode: ColorMode;
  fetching: boolean;
  network: INetwork;
}

export default IProps;
