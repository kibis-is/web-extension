import type { ColorMode } from '@chakra-ui/react';

// types
import type { IAccountStakingApp, INetwork } from '@extension/types';

interface IItemProps {
  app: IAccountStakingApp;
  colorMode: ColorMode;
  network: INetwork;
}

export default IItemProps;
