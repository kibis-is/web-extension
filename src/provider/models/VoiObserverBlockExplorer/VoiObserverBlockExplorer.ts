// models
import BaseBlockExplorer from '@provider/models/BaseBlockExplorer';

// types
import type { TPartialExcept } from '@common/types';
import type { IGroupURLOptions, INewOptions } from '@provider/models/BaseBlockExplorer';

export default class VoiObserverBlockExplorer extends BaseBlockExplorer {
  constructor({ baseURL, canonicalName, id }: TPartialExcept<INewOptions, 'baseURL'>) {
    super({
      baseURL,
      canonicalName: canonicalName || 'Voi Observer',
      id: id || 'voi-observer-block-explorer',
    });
  }

  /**
   * public functions
   */

  public accountURL(address: string): string {
    return `${this._baseURL}/account/${address}`;
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

  public groupURL({ block = '', groupID }: IGroupURLOptions): string {
    return `${this._baseURL}/group/${encodeURIComponent(groupID)}/${block}`;
  }

  public transactionURL(transactionID: string): string {
    return `${this._baseURL}/transaction/${transactionID}`;
  }
}
