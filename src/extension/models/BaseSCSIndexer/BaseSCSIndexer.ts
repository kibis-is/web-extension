// errors
import { NetworkConnectionError, UnknownError } from '@common/errors';

// types
import type { IBaseNetworkServiceProvider } from '@extension/types';
import {
  IFetchByAddressOptions,
  INewOptions,
  ISCSAccount,
  ISCSAccountResponse,
} from './types';

export default abstract class BaseSCSIndexer
  implements IBaseNetworkServiceProvider
{
  // protected variables
  protected readonly _baseURL: string;
  protected readonly _apiPath: string = '/v1/scs';
  // public variables
  public readonly canonicalName: string;
  public readonly id: string;

  protected constructor({ baseURL, canonicalName, id }: INewOptions) {
    this._baseURL = baseURL;
    this.canonicalName = canonicalName;
    this.id = id;
  }

  /**
   * public functions
   */

  public async fetchByAddress({
    address,
    logger,
  }: IFetchByAddressOptions): Promise<ISCSAccount[]> {
    const _functionName = 'fetchByAddress';
    let _error: string;
    let response: Response;
    let result: ISCSAccountResponse;

    try {
      response = await fetch(
        `${this._baseURL}${this._apiPath}/accounts?owner=${address}`
      );
    } catch (error) {
      logger?.error(`${BaseSCSIndexer.name}#${_functionName}:`, error);

      throw new NetworkConnectionError(error.message);
    }

    if (!response.ok) {
      _error = await response.text();

      logger?.error(`${BaseSCSIndexer.name}#${_functionName}: ${_error}`);

      throw new UnknownError(_error);
    }

    result = await response.json();

    return result.accounts || [];
  }
}
