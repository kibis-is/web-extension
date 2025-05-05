// types
import type { IARC0200Asset } from '@provider/types';

interface ISaveOptions {
  genesisHash: string;
  items: IARC0200Asset[];
}

export default ISaveOptions;
