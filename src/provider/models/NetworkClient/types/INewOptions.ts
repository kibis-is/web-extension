// types
import type { IBaseOptions } from '@common/types';
import type { INetwork } from '@provider/types';

interface INewOptions extends IBaseOptions {
  network: INetwork;
}

export default INewOptions;
