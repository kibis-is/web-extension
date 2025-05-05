import type { SessionTypes } from '@walletconnect/types';

// types
import type { INetwork } from '@provider/types';

// utils
import chainReferenceFromGenesisHash from '@provider/utils/chainReferenceFromGenesisHash';

/**
 * Extracts the WalletConnect namespace from the network.
 * @param {INetwork} network - the network to extract the namespace from.
 * @returns {SessionTypes.BaseNamespace} the WalletConnect namespace.
 */
export default function extractWalletConnectNamespaceFromNetwork(network: INetwork): SessionTypes.BaseNamespace {
  return {
    accounts: [],
    chains: [`${network.namespace.key}:${chainReferenceFromGenesisHash(network.genesisHash)}`],
    events: [],
    methods: network.namespace.methods,
  };
}
