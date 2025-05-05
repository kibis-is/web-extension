import type { ColorMode } from '@chakra-ui/react';

// types
import type { IAccountStakingApp, INetwork } from '@provider/types';

interface IItemProps {
  app: IAccountStakingApp;
  colorMode: ColorMode;
  network: INetwork;
  onClick: (id: string) => void;
}

export default IItemProps;
