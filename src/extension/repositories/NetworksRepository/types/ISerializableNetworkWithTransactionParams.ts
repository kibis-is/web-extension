// types
import type {
  IBaseNetworkServiceProvider,
  INetworkWithTransactionParams,
} from '@extension/types';

interface ISerializableNetworkWithTransactionParams
  extends Omit<
    INetworkWithTransactionParams,
    'arc0072Indexers' | 'blockExplorers' | 'nftExplorers' | 'scsIndexers'
  > {
  arc0072Indexers: IBaseNetworkServiceProvider[];
  blockExplorers: IBaseNetworkServiceProvider[];
  nftExplorers: IBaseNetworkServiceProvider[];
  scsIndexers: IBaseNetworkServiceProvider[];
}

export default ISerializableNetworkWithTransactionParams;
