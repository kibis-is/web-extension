import type { ColorMode } from '@chakra-ui/react';

// types
import type {
  IAccountWithExtendedProps,
  INetworkWithTransactionParams,
} from '@extension/types';

interface IProps {
  account: IAccountWithExtendedProps;
  colorMode: ColorMode;
  fetching: boolean;
  network: INetworkWithTransactionParams;
}

export default IProps;
