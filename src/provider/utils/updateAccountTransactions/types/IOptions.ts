// types
import type { IBaseOptions } from '@common/types';
import type { IAccountTransactions, INetwork } from '@provider/types';

interface IOptions extends IBaseOptions {
  address: string;
  currentAccountTransactions: IAccountTransactions;
  delay?: number;
  network: INetwork;
  nodeID: string | null;
  refresh?: boolean;
}

export default IOptions;
