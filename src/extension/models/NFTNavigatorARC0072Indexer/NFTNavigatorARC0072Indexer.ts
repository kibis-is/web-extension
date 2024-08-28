// models
import BaseARC0072Indexer from '../BaseARC0072Indexer';

// types
import type { IFetchTokensByOwnerOptions } from '@extension/models/BaseARC0072Indexer';
import type { IARC0072AssetHolding } from '@extension/types';

export default class NFTNavigatorARC0072Indexer extends BaseARC0072Indexer {
  constructor(baseURL: string) {
    super({
      baseURL,
      canonicalName: 'NFT Navigator',
      id: 'nft-navigator-arc-0072-indexer',
    });
  }

  /**
   * public functions
   */

  public async fetchTokensByOwner(
    options: IFetchTokensByOwnerOptions
  ): Promise<IARC0072AssetHolding[]> {
    return await super.fetchTokensByOwner(options);
  }
}