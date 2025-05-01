// types
import type {
  IBaseNetworkServiceProvider,
  INetworkWithTransactionParams,
} from '@extension/types';

interface ISerializableNetworkWithTransactionParams
  extends Omit<
    INetworkWithTransactionParams,
    'arc0072Indexers' | 'blockExplorers' | 'enVoi' | 'nftExplorers'
  > {
  arc0072Indexers: IBaseNetworkServiceProvider[];
  blockExplorers: IBaseNetworkServiceProvider[];
  enVoi: string | null;
  nftExplorers: IBaseNetworkServiceProvider[];
}

export default ISerializableNetworkWithTransactionParams;
