// types
import type { ILogger } from '@common/types';
import type {
  IEnVoiClientParameters,
  IEnVoiResponse,
  INameResolutionResult,
} from './types';

export default class EnVoiClient {
  // public static variables
  public static displayName = 'EnVoiClient';
  // private variables
  private readonly _logger: ILogger | undefined;
  private _url: string;

  public constructor({ logger, url }: IEnVoiClientParameters) {
    this._logger = logger;
    this._url = url;
  }

  /**
   * private methods
   */

  private async _request<Response>(path: string): Promise<Response> {
    const { json } = await fetch(`${this._url}/api/${path}`);

    return (await json()) as Response;
  }

  /**
   * public methods
   */

  public async names(address: string): Promise<string[]> {
    const __logPrefix = `${EnVoiClient.displayName}#names`;

    try {
      const result = await this._request<IEnVoiResponse<INameResolutionResult>>(
        `/name/${address}`
      );

      return result.results.map(({ name }) => name);
    } catch (error) {
      this._logger?.error(`${__logPrefix}:`, error);

      return [];
    }
  }

  public url(): string {
    return this._url;
  }
}
