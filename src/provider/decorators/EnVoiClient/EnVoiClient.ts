// types
import type { IEnVoiClientParameters, IEnVoiResponse, INameResolutionResult } from './types';

export default class EnVoiClient {
  // public static variables
  public static displayName = 'EnVoiClient';
  // private variables
  private readonly _contractID: string;
  private readonly _url: string;

  public constructor({ contractID, url }: IEnVoiClientParameters) {
    this._contractID = contractID;
    this._url = url;
  }

  /**
   * private methods
   */

  private async _request<Response>(path: string): Promise<Response> {
    const response = await fetch(`${this._url}/api/${path}`);

    return (await response.json()) as Response;
  }

  /**
   * public methods
   */

  public contractID(): string {
    return this._contractID;
  }

  /**
   * Gets the name for a given address.
   * @param {string} address - The address to find the names of.
   * @returns {Promise<string | null>} A promise that resolves to the primary name for the given address.
   * @public
   */
  public async name(address: string): Promise<string | null> {
    const result = await this._request<IEnVoiResponse<INameResolutionResult>>(`/name/${address}`);

    return result.results[0]?.name ?? null;
  }

  public url(): string {
    return this._url;
  }
}
