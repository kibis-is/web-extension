import {
  BaseError,
  BaseWalletManager,
  FailedToPostSomeTransactionsError,
  IEnableOptions,
  IEnableResult,
  InvalidGroupIdError,
  InvalidInputError,
  IPostTxnsResult,
  ISignBytesOptions,
  ISignBytesResult,
  ISignTxnsOptions,
  ISignTxnsResult,
  NetworkNotSupportedError,
  OperationCanceledError,
  UnauthorizedSignerError,
  UnknownError,
  WalletOperationNotSupportedError,
} from '@agoralabs-sh/algorand-provider';
import {
  ARC0027ErrorCodeEnum,
  ARC0027FailedToPostSomeTransactionsError,
  ARC0027MethodNotSupportedError,
  ARC0027NetworkNotSupportedError,
  ARC0027UnauthorizedSignerError,
  AVMWebClient,
  BaseARC0027Error,
  UPPER_REQUEST_TIMEOUT,
} from '@agoralabs-sh/avm-web-provider';
import { decode as decodeBase64 } from '@stablelib/base64';

/**
 * This adapter is used to capture requests from a client's interactions with the algorand-provider. It proxies the
 * request to the provider using the avm-web-provider schema - map the requests and responses between the two
 * connectors.
 *
 * The reasoning behind this is to ensure that when the support for the algorand-provider is dropped, there will be
 * minimal impact on changes.
 *
 * @see {@link https://github.com/agoralabs-sh/algorand-provider}
 * @deprecated algorand-provider is no longer maintained and this adapter will be phased out in a future update.
 */
export default class LegacyProviderAdapter extends BaseWalletManager {
  // private variables
  private readonly _avmWebClient: AVMWebClient;

  constructor() {
    super({
      id: 'kibisis',
    });

    this._avmWebClient = AVMWebClient.init();
  }

  /**
   * private methods
   */

  private _mapARC0027ErrorToLegacyError(error: BaseARC0027Error): BaseError {
    switch (error.code) {
      case ARC0027ErrorCodeEnum.FailedToPostSomeTransactionsError:
        return new FailedToPostSomeTransactionsError(
          (
            error as ARC0027FailedToPostSomeTransactionsError
          ).data.successTxnIDs,
          error.message
        );
      case ARC0027ErrorCodeEnum.InvalidGroupIdError:
        return new InvalidGroupIdError('', error.message);
      case ARC0027ErrorCodeEnum.InvalidInputError:
        return new InvalidInputError(error.message);
      case ARC0027ErrorCodeEnum.MethodCanceledError:
      case ARC0027ErrorCodeEnum.MethodTimedOutError:
        return new OperationCanceledError(error.message);
      case ARC0027ErrorCodeEnum.MethodNotSupportedError:
        return new WalletOperationNotSupportedError(
          (error as ARC0027MethodNotSupportedError).data.method,
          error.message
        );
      case ARC0027ErrorCodeEnum.NetworkNotSupportedError:
        return new NetworkNotSupportedError(
          (error as ARC0027NetworkNotSupportedError).data.genesisHashes[0],
          error.message
        );
      case ARC0027ErrorCodeEnum.UnauthorizedSignerError:
        return new UnauthorizedSignerError(
          (error as ARC0027UnauthorizedSignerError).data.signer || '',
          error.message
        );
      default:
        return new UnknownError(error.message);
    }
  }

  /**
   * public functions
   */

  public async enable(options?: IEnableOptions): Promise<IEnableResult> {
    return new Promise<IEnableResult>((resolve, reject) => {
      let listenerId: string;
      let timeoutId = window.setTimeout(() => {
        // remove the listener, it is not needed
        if (listenerId) {
          this._avmWebClient.removeListener(listenerId);
        }

        return reject(
          new OperationCanceledError(`operation "enable" timed out`)
        );
      }, UPPER_REQUEST_TIMEOUT);
      listenerId = this._avmWebClient.onEnable(({ error, result }) => {
        // remove the listener, it is not needed
        this._avmWebClient.removeListener(listenerId);

        if (error) {
          window.clearTimeout(timeoutId);

          return reject(this._mapARC0027ErrorToLegacyError(error));
        }

        if (result) {
          window.clearTimeout(timeoutId);

          return resolve({
            accounts: result.accounts.map(({ address, name }) => ({
              address,
              name,
            })),
            genesisHash: result.genesisHash,
            genesisId: result.genesisId,
            sessionId: result.sessionId,
          });
        }
      });

      this._avmWebClient.enable({
        genesisHash: options?.genesisHash,
        providerId: __PROVIDER_ID__,
      });
    });
  }

  public async postTxns(): Promise<IPostTxnsResult> {
    throw new WalletOperationNotSupportedError(this.id, 'postTxns');
  }

  public async signBytes({
    data,
    signer,
  }: ISignBytesOptions): Promise<ISignBytesResult> {
    return new Promise<ISignBytesResult>((resolve, reject) => {
      let listenerId: string;
      let timeoutId = window.setTimeout(() => {
        // remove the listener, it is not needed
        if (listenerId) {
          this._avmWebClient.removeListener(listenerId);
        }

        return reject(
          new OperationCanceledError(`operation "signBytes" timed out`)
        );
      }, UPPER_REQUEST_TIMEOUT);
      listenerId = this._avmWebClient.onSignMessage(({ error, result }) => {
        // remove the listener, it is not needed
        this._avmWebClient.removeListener(listenerId);

        if (error) {
          window.clearTimeout(timeoutId);

          return reject(this._mapARC0027ErrorToLegacyError(error));
        }

        if (result) {
          window.clearTimeout(timeoutId);

          return resolve({
            signature: decodeBase64(result.signature),
          });
        }
      });

      this._avmWebClient.signMessage({
        message: new TextDecoder().decode(data),
        providerId: __PROVIDER_ID__,
        signer,
      });
    });
  }

  public async signTxns({ txns }: ISignTxnsOptions): Promise<ISignTxnsResult> {
    return new Promise<ISignTxnsResult>((resolve, reject) => {
      let listenerId: string;
      let timeoutId = window.setTimeout(() => {
        // remove the listener, it is not needed
        if (listenerId) {
          this._avmWebClient.removeListener(listenerId);
        }

        return reject(
          new OperationCanceledError(`operation "signTxns" timed out`)
        );
      }, UPPER_REQUEST_TIMEOUT);
      listenerId = this._avmWebClient.onSignTransactions(
        ({ error, result }) => {
          // remove the listener, it is not needed
          this._avmWebClient.removeListener(listenerId);

          if (error) {
            window.clearTimeout(timeoutId);

            return reject(this._mapARC0027ErrorToLegacyError(error));
          }

          if (result) {
            window.clearTimeout(timeoutId);

            return resolve({
              stxns: result.stxns,
            });
          }
        }
      );

      this._avmWebClient.signTransactions({
        providerId: __PROVIDER_ID__,
        txns,
      });
    });
  }
}
