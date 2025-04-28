// types
import type {
  IEnVoiClientParameters,
  IEnVoiResponse,
  INameResolutionResult,
} from './types';

export default class EnVoiClient {
  // public static variables
  public static displayName = 'EnVoiClient';
  // private variables
  private readonly _url: string;

  public constructor({ url }: IEnVoiClientParameters) {
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

  public async names(address: string): Promise<string[]> {
    const result = await this._request<IEnVoiResponse<INameResolutionResult>>(
      `/name/${address}`
    );

    return result.results.map(({ name }) => name);
  }

  public url(): string {
    return this._url;
  }
}
