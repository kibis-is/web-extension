// types
import type { TSizes } from '@common/types';
import type { IAccount, INetwork } from '@extension/types';

interface IProps {
  accounts: IAccount[];
  address: string;
  ariaLabel?: string;
  colorScheme?: string;
  network: INetwork;
  size?: TSizes;
}

export default IProps;
