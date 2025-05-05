// types
import type { IBaseNetworkServiceProvider } from '@provider/types';
import type { IGroupURLOptions, INewOptions } from './types';

export default abstract class BaseBlockExplorer implements IBaseNetworkServiceProvider {
  // protected variables
  protected readonly _baseURL: string;
  // public variables
  public readonly canonicalName: string;
  public readonly id: string;

  protected constructor({ baseURL, canonicalName, id }: INewOptions) {
    this._baseURL = baseURL;
    this.canonicalName = canonicalName;
    this.id = id;
  }

  /**
   * public abstract functions
   */

  public abstract accountURL(address: string): string;
  public abstract applicationURL(appID: string): string;
  public abstract assetURL(assetID: string): string;
  public abstract blockURL(block: string): string;
  public abstract groupURL(options: IGroupURLOptions): string;
  public abstract transactionURL(transactionID: string): string;
}
