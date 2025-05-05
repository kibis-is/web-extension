// types
import type { IAccount, INetwork } from '@provider/types';

interface IOptions {
  account: IAccount;
  network: INetwork;
  numOfStandardAssets?: number;
}

export default IOptions;
