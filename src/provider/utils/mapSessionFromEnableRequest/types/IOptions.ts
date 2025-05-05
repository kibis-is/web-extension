// types
import type { IClientInformation } from '@common/types';
import type { INetwork } from '@provider/types';

interface IOptions {
  authorizedAddresses: string[];
  clientInfo: IClientInformation;
  network: INetwork;
}

export default IOptions;
