// models
import BaseBlockExplorer from '@provider/models/BaseBlockExplorer';

// types
import type { TPartialExcept } from '@common/types';
import type { IGroupURLOptions, INewOptions } from '@provider/models/BaseBlockExplorer';

export default class AVMExplorerBlockExplorer extends BaseBlockExplorer {
  constructor({ baseURL, canonicalName, id }: TPartialExcept<INewOptions, 'baseURL'>) {
    super({
      baseURL: baseURL,
      canonicalName: canonicalName || 'AVM Explorer',
      id: id || 'avm-explorer-block-explorer',
    });
  }

  /**
   * public functions
   */

  public accountURL(address: string): string {
    return `${this._baseURL}/address/${address}`;
  }

  public applicationURL(appID: string): string {
    return `${this._baseURL}/app/${appID}`;
  }

  public assetURL(assetID: string): string {
    return `${this._baseURL}/asset/${assetID}`;
  }

  public blockURL(block: string): string {
    return `${this._baseURL}/block/${block}`;
  }

  public groupURL({ groupID }: IGroupURLOptions): string {
    return `${this._baseURL}/group/${encodeURIComponent(groupID)}`;
  }

  public transactionURL(transactionID: string): string {
    return `${this._baseURL}/tx/${transactionID}`;
  }
}
