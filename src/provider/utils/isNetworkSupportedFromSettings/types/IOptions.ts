// types
import type { INetwork, ISettings } from '@provider/types';

interface IOptions {
  genesisHash: string;
  networks: INetwork[];
  settings: ISettings;
}

export default IOptions;
