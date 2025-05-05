import { ARC0027MethodEnum } from '@agoralabs-sh/avm-web-provider';

// decorators
import EnVoiClient from '@provider/decorators/EnVoiClient';

// enums
import { NetworkTypeEnum } from '@provider/enums';

// models
import BaseBlockExplorer from '@provider/models/BaseBlockExplorer';
import BaseARC0072Indexer from '@provider/models/BaseARC0072Indexer';
import BaseNFTExplorer from '@provider/models/BaseNFTExplorer';
import BaseSCSIndexer from '@provider/models/BaseSCSIndexer';

// types
import type { INativeCurrency } from '../assets';
import type IChainNamespace from './IChainNamespace';
import type INode from './INode';

interface INetwork {
  algods: INode[];
  arc0072Indexers: BaseARC0072Indexer[];
  blockExplorers: BaseBlockExplorer[];
  canonicalName: string;
  chakraTheme: string;
  enVoi: EnVoiClient | null;
  feeSunkAddress: string;
  genesisHash: string;
  genesisId: string;
  indexers: INode[];
  methods: ARC0027MethodEnum[];
  namespace: IChainNamespace;
  nativeCurrency: INativeCurrency;
  nftExplorers: BaseNFTExplorer[];
  scsIndexers: BaseSCSIndexer[];
  type: NetworkTypeEnum;
}

export default INetwork;
