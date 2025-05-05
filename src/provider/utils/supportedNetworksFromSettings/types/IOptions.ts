// types
import type { INetwork, ISettings } from '@provider/types';

interface IOptions<T extends INetwork> {
  networks: T[];
  settings: ISettings;
}

export default IOptions;
