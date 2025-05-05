// types
import type { IAccountWithExtendedProps, INetwork } from '@provider/types';

interface IOptions {
  accounts: IAccountWithExtendedProps[];
  network: INetwork;
}

export default IOptions;
