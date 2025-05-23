import type { StackProps } from '@chakra-ui/react';

// models
import BaseBlockExplorer from '@provider/models/BaseBlockExplorer';

// types
import type { IAccount, INetwork } from '@provider/types';

interface IProps extends StackProps {
  accounts: IAccount[];
  address: string;
  explorer?: BaseBlockExplorer | null;
  isLoading?: boolean;
  label: string;
  network: INetwork;
  showCopyButton?: boolean;
}

export default IProps;
