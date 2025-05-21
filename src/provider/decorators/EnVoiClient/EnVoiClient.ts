// types
import type { IEnVoiHolding } from '@provider/types';
import type {
  IEnVoiClientParameters,
  IEnVoiResponse,
  INameResolutionResult,
  ITokenIDResolutionResponse,
} from './types';

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

  /**
   * Gets the enVois from the token IDs.
   * @param {string[]} tokenIDs - A list of token IDs.
   * @returns {Promise<IEnVoiHolding[]>} A promise that resolves to the enVois for the given token IDs.
   * @public
   */
  public async fromTokenIDs(tokenIDs: string[]): Promise<IEnVoiHolding[]> {
    let result: IEnVoiResponse<ITokenIDResolutionResponse>;

    if (tokenIDs.length <= 0) {
      return [];
    }

    result = await this._request<IEnVoiResponse<ITokenIDResolutionResponse>>(`/token/${tokenIDs.join(',')}`);

    return result.results.reduce<IEnVoiHolding[]>(
      (acc, { name, token_id }) => (!name ? acc : [...acc, { name, tokenID: token_id }]),
      []
    );
  }

  public url(): string {
    return this._url;
  }
}
