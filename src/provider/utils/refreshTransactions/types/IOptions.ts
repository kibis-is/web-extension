// types
import type { IBaseOptions } from '@common/types';
import type { INetwork } from '@provider/types';

interface IOptions extends IBaseOptions {
  address: string;
  afterTime: number;
  delay?: number;
  next: string | null;
  network: INetwork;
  nodeID: string | null;
}

export default IOptions;
