// constants
import { SUPPORTED_METHODS } from '@common/constants';
import {
  ALGORAND_ICON_URI,
  ALGORAND_LISTING_ICON_URI,
  VOI_ICON_URI,
  VOI_LISTING_ICON_URI,
} from '@extension/constants';

// decorators
import EnVoiClient from '@extension/decorators/EnVoiClient';

// enums
import { AssetTypeEnum, NetworkTypeEnum } from '@extension/enums';

// models
import AlloBlockExplorer from '@extension/models/AlloBlockExplorer';
import NautilusARC0072Indexer from '@extension/models/NautilusARC0072Indexer';
import NFTNavigatorARC0072Indexer from '@extension/models/NFTNavigatorARC0072Indexer';
import NFTNavigatorNFTExplorer from '@extension/models/NFTNavigatorNFTExplorer';
import PeraBlockExplorer from '@extension/models/PeraBlockExplorer';
import VoiBlockExplorer from '@extension/models/VoiBlockExplorer';
import VoiObserverBlockExplorer from '@extension/models/VoiObserverBlockExplorer';

// types
import type { INetwork } from '@extension/types';

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
        baseURL: 'https://block.voi.network',
      }),
      new VoiObserverBlockExplorer({
        baseURL: 'https://explorer.voi.network/explorer',
        canonicalName: 'Voi Network',
        id: 'voi-network',
      }),
    ],
    enVoi: new EnVoiClient({
      url: 'https://api.envoi.sh',
    }),
    feeSunkAddress:
      'TBEIGCNK4UCN3YDP2NODK3MJHTUZMYS3TABRM2MVSI2MPUR2V36E5JYHSY',
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
        baseURL: 'https://testnet.block.voi.network',
      }),
    ],
    enVoi: null,
    feeSunkAddress:
      'TBEIGCNK4UCN3YDP2NODK3MJHTUZMYS3TABRM2MVSI2MPUR2V36E5JYHSY',
    genesisId: 'voitest',
    genesisHash: '5pbhGq04byd0AgV/sbP+yITANqazgKBuaATr85n21wY=',
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
    feeSunkAddress:
      'Y76M3MSY6DKBRHBL7C3NNDXGS5IIMQVQVUAB6MP4XEMMGVF2QWNPL226CA',
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
    feeSunkAddress:
      'A7NMWS3NT3IUDMLVO26ULGXGIIOUQ3ND2TXSER6EBGRZNOBOUIQXHIBGDE',
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
    feeSunkAddress:
      'A7NMWS3NT3IUDMLVO26ULGXGIIOUQ3ND2TXSER6EBGRZNOBOUIQXHIBGDE',
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
    type: NetworkTypeEnum.Test,
  },
];

export default networks;
