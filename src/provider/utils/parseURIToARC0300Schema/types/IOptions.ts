// types
import type { IBaseOptions } from '@common/types';
import type { INetwork } from '@provider/types';

interface IOptions extends IBaseOptions {
  supportedNetworks: INetwork[];
}

export default IOptions;
