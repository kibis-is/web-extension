// types
import type { IStandardAsset } from '@provider/types';

interface ISaveOptions {
  genesisHash: string;
  items: IStandardAsset[];
}

export default ISaveOptions;
