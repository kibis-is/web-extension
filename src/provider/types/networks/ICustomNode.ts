// types
import type { INode } from '@provider/types';

interface ICustomNode {
  algod: Omit<INode, 'canonicalName' | 'id'> | null;
  genesisHash: string;
  id: string;
  indexer: Omit<INode, 'canonicalName' | 'id'> | null;
  name: string;
}

export default ICustomNode;
