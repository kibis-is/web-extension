// types
import type { IBaseOptions } from '@common/types';
import type { INetwork, IStandardAsset } from '@provider/types';

interface IOptions extends IBaseOptions {
  amountInAtomicUnits: string;
  asset: IStandardAsset;
  fromAddress: string;
  network: INetwork;
  nodeID: string | null;
  note: string | null;
  toAddress: string;
}

export default IOptions;
