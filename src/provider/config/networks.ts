// constants
import { SUPPORTED_METHODS } from '@common/constants';
import { ALGORAND_ICON_URI, ALGORAND_LISTING_ICON_URI, VOI_ICON_URI, VOI_LISTING_ICON_URI } from '@provider/constants';

// decorators
import EnVoiClient from '@provider/decorators/EnVoiClient';

// enums
import { AssetTypeEnum, NetworkTypeEnum } from '@provider/enums';

// models
import AlloBlockExplorer from '@provider/models/AlloBlockExplorer';
import NautilusARC0072Indexer from '@provider/models/NautilusARC0072Indexer';
import NautilusSCSIndexer from '@provider/models/NautilusSCSIndexer';
import NFTNavigatorARC0072Indexer from '@provider/models/NFTNavigatorARC0072Indexer';
import NFTNavigatorNFTExplorer from '@provider/models/NFTNavigatorNFTExplorer';
import PeraBlockExplorer from '@provider/models/PeraBlockExplorer';
import VoiBlockExplorer from '@provider/models/VoiBlockExplorer';
import VoiObserverBlockExplorer from '@provider/models/VoiObserverBlockExplorer';

// types
import type { INetwork } from '@provider/types';

const networks: INetwork[] = [
  /**
   * voi networks
   */
  {
    algods: [
      {
        canonicalName: 'Nodely',
        id: null,
        port: null,
        token: null,
        url: 'https://mainnet-api.voi.nodely.dev',
      },
    ],
    arc0072Indexers: [
      new NautilusARC0072Indexer({
        baseURL: 'https://mainnet-idx.nautilus.sh',
      }),
      new NFTNavigatorARC0072Indexer({
        baseURL: 'https://arc72-voi-mainnet.nftnavigator.xyz',
      }),
    ],
    canonicalName: 'Voi',
    chakraTheme: 'voi',
    blockExplorers: [
      new VoiBlockExplorer({
        baseURL: 'https://block.voi.network/explorer',
      }),
      new VoiObserverBlockExplorer({
        baseURL: 'https://explorer.voi.network/explorer',
        canonicalName: 'Voi Network',
        id: 'voi-network',
      }),
    ],
    enVoi: new EnVoiClient({
      contractID: '797609',
      url: 'https://api.envoi.sh',
    }),
    feeSunkAddress: 'TBEIGCNK4UCN3YDP2NODK3MJHTUZMYS3TABRM2MVSI2MPUR2V36E5JYHSY',
    genesisId: 'voimain-v1.0',
    genesisHash: 'r20fSQI8gWe/kFZziNonSPCXLwcQmH/nxROvnnueWOk=',
    indexers: [
      {
        canonicalName: 'Nodely',
        id: null,
        port: null,
        token: null,
        url: 'https://mainnet-idx.voi.nodely.dev',
      },
    ],
    methods: SUPPORTED_METHODS,
    namespace: {
      key: 'avm',
      methods: ['avm_signTransactions', 'avm_signMessage'],
    },
    nativeCurrency: {
      decimals: 6,
      iconUrl: VOI_ICON_URI,
      listingUri: VOI_LISTING_ICON_URI,
      symbol: 'VOI',
      type: AssetTypeEnum.Native,
      verified: true,
    },
    nftExplorers: [
      new NFTNavigatorNFTExplorer({
        baseURL: 'https://nftnavigator.xyz',
      }),
    ],
    scsIndexers: [
      new NautilusSCSIndexer({
        baseURL: 'https://mainnet-idx.nautilus.sh',
      }),
    ],
    type: NetworkTypeEnum.Stable,
  },
  {
    algods: [
      {
        canonicalName: 'Nodely',
        id: null,
        port: null,
        token: null,
        url: 'https://testnet-api.voi.nodely.dev',
      },
    ],
    arc0072Indexers: [],
    canonicalName: 'Voi',
    chakraTheme: 'voi',
    blockExplorers: [
      new VoiBlockExplorer({
        baseURL: 'https://testnet.block.voi.network/explorer',
      }),
    ],
    enVoi: null,
    feeSunkAddress: 'TBEIGCNK4UCN3YDP2NODK3MJHTUZMYS3TABRM2MVSI2MPUR2V36E5JYHSY',
    genesisId: 'voitest',
    genesisHash: 'mufvzhECYAe3WaU075v0z4k1/SNUIuUPCyBTE+Z/08s=',
    indexers: [
      {
        canonicalName: 'Nodely',
        id: null,
        port: null,
        token: null,
        url: 'https://testnet-idx.voi.nodely.dev',
      },
    ],
    methods: SUPPORTED_METHODS,
    namespace: {
      key: 'avm',
      methods: ['avm_signTransactions', 'avm_signMessage'],
    },
    nativeCurrency: {
      decimals: 6,
      iconUrl: VOI_ICON_URI,
      listingUri: VOI_LISTING_ICON_URI,
      symbol: 'VOI',
      type: AssetTypeEnum.Native,
      verified: true,
    },
    nftExplorers: [],
    scsIndexers: [],
    type: NetworkTypeEnum.Test,
  },
  /**
   * algorand networks
   */
  {
    algods: [
      {
        canonicalName: 'AlgoNode',
        id: null,
        port: null,
        token: null,
        url: 'https://mainnet-api.algonode.cloud',
      },
    ],
    arc0072Indexers: [],
    canonicalName: 'Algorand',
    chakraTheme: 'algorand',
    blockExplorers: [
      new PeraBlockExplorer({
        baseURL: 'https://explorer.perawallet.app',
      }),
      new AlloBlockExplorer({
        baseURL: 'https://allo.info',
      }),
    ],
    enVoi: null,
    feeSunkAddress: 'Y76M3MSY6DKBRHBL7C3NNDXGS5IIMQVQVUAB6MP4XEMMGVF2QWNPL226CA',
    genesisId: 'mainnet-v1.0',
    genesisHash: 'wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=',
    indexers: [
      {
        canonicalName: 'AlgoNode',
        id: null,
        port: null,
        token: null,
        url: 'https://mainnet-idx.algonode.cloud',
      },
    ],
    methods: SUPPORTED_METHODS,
    namespace: {
      key: 'algorand',
      methods: ['algo_signTxn'],
    },
    nativeCurrency: {
      decimals: 6,
      iconUrl: ALGORAND_ICON_URI,
      listingUri: ALGORAND_LISTING_ICON_URI,
      symbol: 'ALGO',
      type: AssetTypeEnum.Native,
      verified: true,
    },
    nftExplorers: [],
    scsIndexers: [],
    type: NetworkTypeEnum.Stable,
  },
  {
    algods: [
      {
        canonicalName: 'AlgoNode',
        id: null,
        port: null,
        token: null,
        url: 'https://betanet-api.algonode.cloud',
      },
    ],
    arc0072Indexers: [],
    canonicalName: 'Algorand',
    chakraTheme: 'algorand',
    blockExplorers: [],
    enVoi: null,
    feeSunkAddress: 'A7NMWS3NT3IUDMLVO26ULGXGIIOUQ3ND2TXSER6EBGRZNOBOUIQXHIBGDE',
    genesisId: 'betanet-v1.0',
    genesisHash: 'mFgazF+2uRS1tMiL9dsj01hJGySEmPN28B/TjjvpVW0=',
    indexers: [
      {
        canonicalName: 'AlgoNode',
        id: null,
        port: null,
        token: null,
        url: 'https://betanet-idx.algonode.cloud',
      },
    ],
    methods: SUPPORTED_METHODS,
    namespace: {
      key: 'algorand',
      methods: ['algo_signTxn'],
    },
    nativeCurrency: {
      decimals: 6,
      iconUrl: ALGORAND_ICON_URI,
      listingUri: ALGORAND_LISTING_ICON_URI,
      symbol: 'ALGO',
      type: AssetTypeEnum.Native,
      verified: true,
    },
    nftExplorers: [],
    scsIndexers: [],
    type: NetworkTypeEnum.Beta,
  },
  {
    algods: [
      {
        canonicalName: 'AlgoNode',
        id: null,
        port: null,
        token: null,
        url: 'https://testnet-api.algonode.cloud',
      },
    ],
    arc0072Indexers: [],
    canonicalName: 'Algorand',
    chakraTheme: 'algorand',
    blockExplorers: [
      new PeraBlockExplorer({
        baseURL: 'https://testnet.explorer.perawallet.app',
      }),
    ],
    enVoi: null,
    feeSunkAddress: 'A7NMWS3NT3IUDMLVO26ULGXGIIOUQ3ND2TXSER6EBGRZNOBOUIQXHIBGDE',
    genesisId: 'testnet-v1.0',
    genesisHash: 'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
    indexers: [
      {
        canonicalName: 'AlgoNode',
        id: null,
        port: null,
        token: null,
        url: 'https://testnet-idx.algonode.cloud',
      },
    ],
    methods: SUPPORTED_METHODS,
    namespace: {
      key: 'algorand',
      methods: ['algo_signTxn'],
    },
    nativeCurrency: {
      decimals: 6,
      iconUrl: ALGORAND_ICON_URI,
      listingUri: ALGORAND_LISTING_ICON_URI,
      symbol: 'ALGO',
      type: AssetTypeEnum.Native,
      verified: true,
    },
    nftExplorers: [],
    scsIndexers: [],
    type: NetworkTypeEnum.Test,
  },
];

export default networks;
