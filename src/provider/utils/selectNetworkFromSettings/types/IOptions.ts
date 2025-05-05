// types
import type { INetwork, ISettings } from '@provider/types';

interface IOptions<T extends INetwork> {
  networks: T[];
  settings: ISettings;
  withDefaultFallback?: boolean;
}

export default IOptions;
