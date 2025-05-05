// models
import BaseBlockExplorer from '@provider/models/BaseBlockExplorer';

// types
import type { TPartialExcept } from '@common/types';
import type { IGroupURLOptions, INewOptions } from '@provider/models/BaseBlockExplorer';

export default class PeraBlockExplorer extends BaseBlockExplorer {
  constructor({ baseURL, canonicalName, id }: TPartialExcept<INewOptions, 'baseURL'>) {
    super({
      baseURL,
      canonicalName: canonicalName || 'Pera',
      id: id || 'pera-block-explorer',
    });
  }

  /**
   * public functions
   */

  public accountURL(address: string): string {
    return `${this._baseURL}/address/${address}`;
  }

  public applicationURL(appID: string): string {
    return `${this._baseURL}/application/${appID}`;
  }

  public assetURL(assetID: string): string {
    return `${this._baseURL}/asset/${assetID}`;
  }

  public blockURL(block: string): string {
    return `${this._baseURL}/block/${block}`;
  }

  public groupURL({ groupID }: IGroupURLOptions): string {
    return `${this._baseURL}/tx-group/${encodeURIComponent(groupID)}`;
  }

  public transactionURL(transactionID: string): string {
    return `${this._baseURL}/tx/${transactionID}`;
  }
}
