import {
  ARC0027MethodEnum,
  IDiscoverResult,
  IEnableResult,
  TRequestParams,
  TResponseResults,
  ISignTransactionsResult,
} from '@agoralabs-sh/avm-web-provider';
import browser from 'webextension-polyfill';

// enums
import {
  AVMWebProviderMessageReferenceEnum,
  LegacyUseWalletMessageReferenceEnum,
} from '@common/enums';

// messages
import AVMWebProviderRequestMessage from '@common/messages/AVMWebProviderRequestMessage';
import AVMWebProviderResponseMessage from '@common/messages/AVMWebProviderResponseMessage';
import {
  LegacyUseWalletRequestMessage,
  LegacyUseWalletResponseMessage,
} from './messages';

// services
import BaseListener from '@common/services/BaseListener';

// types
import { ILegacyDiscoverResult, IUseWalletNetworkConfiguration } from './types';

// utils
import createClientInformation from '@common/utils/createClientInformation';

/**
 * @deprecated will be phased out in favour of the avm-web-provider
 */
export default class LegacyUseWalletMessageBroker extends BaseListener {
  // public static variables
  public static displayName = 'LegacyUseWalletMessageBroker';
  // private variables
  private _channel: BroadcastChannel;

  /**
   * private methods
   */

  private _mapLegacyResponse({
    error,
    id,
    method,
    requestID,
    result,
  }: AVMWebProviderResponseMessage<TResponseResults>): LegacyUseWalletResponseMessage<
    IEnableResult | ILegacyDiscoverResult | ISignTransactionsResult
  > | null {
    const reference = this._mapResponseMessageReferenceFromMethod(method);

    if (!reference) {
      return null;
    }

    // use the legacy method names for discover messages
    if (method === ARC0027MethodEnum.Discover && result) {
      return new LegacyUseWalletResponseMessage<ILegacyDiscoverResult>({
        error: null,
        id,
        reference,
        requestId: requestID,
        result: {
          ...(result as IDiscoverResult),
          networks: (result as IDiscoverResult).networks.map(
            ({ methods, ...otherProps }) => ({
              ...otherProps,
              methods: methods.map((method) =>
                method === ARC0027MethodEnum.SignTransactions
                  ? 'signTxns'
                  : method
              ),
            })
          ) as IUseWalletNetworkConfiguration[],
        },
      });
    }

    return new LegacyUseWalletResponseMessage<
      IEnableResult | ISignTransactionsResult
    >({
      error: error || null,
      id,
      reference,
      requestId: requestID,
      result: (result as IEnableResult | ISignTransactionsResult) || null,
    });
  }

  private _mapMethodFromResponseMessageReference(
    reference: LegacyUseWalletMessageReferenceEnum
  ): ARC0027MethodEnum | null {
    switch (reference) {
      case LegacyUseWalletMessageReferenceEnum.EnableRequest:
        return ARC0027MethodEnum.Enable;
      case LegacyUseWalletMessageReferenceEnum.GetProvidersRequest:
        return ARC0027MethodEnum.Discover;
      case LegacyUseWalletMessageReferenceEnum.SignTxnsRequest:
        return ARC0027MethodEnum.SignTransactions;
      default:
        return null;
    }
  }

  private _mapResponseMessageReferenceFromMethod(
    method: ARC0027MethodEnum
  ): LegacyUseWalletMessageReferenceEnum | null {
    switch (method) {
      case ARC0027MethodEnum.Discover:
        return LegacyUseWalletMessageReferenceEnum.GetProvidersResponse;
      case ARC0027MethodEnum.Enable:
        return LegacyUseWalletMessageReferenceEnum.EnableResponse;
      case ARC0027MethodEnum.SignTransactions:
        return LegacyUseWalletMessageReferenceEnum.SignTxnsResponse;
      default:
        return null;
    }
  }

  private async _onClientMessage(
    message: MessageEvent<LegacyUseWalletRequestMessage<TRequestParams>>
  ): Promise<void> {
    const __function = '_onClientMessage';
    const method = this._mapMethodFromResponseMessageReference(
      message.data.reference
    );

    if (method) {
      this._logger?.debug(
        `${LegacyUseWalletMessageBroker.displayName}#${__function}: legacy request message "${message.data.reference}" received`
      );

      // send the message to the background script/popups
      return await browser.runtime.sendMessage(
        new AVMWebProviderRequestMessage({
          id: message.data.id,
          payload: {
            clientInfo: createClientInformation(),
            method,
            ...(message.data.params && {
              params: message.data.params,
            }),
          },
          reference: AVMWebProviderMessageReferenceEnum.Request,
        })
      );
    }
  }

  private _onProviderMessage(
    message: AVMWebProviderResponseMessage<TResponseResults>
  ): void {
    const __function = '_onProviderMessage';
    let legacyResponse: LegacyUseWalletResponseMessage<
      IEnableResult | ILegacyDiscoverResult | ISignTransactionsResult
    > | null;

    switch (message.method) {
      case ARC0027MethodEnum.Discover:
      case ARC0027MethodEnum.Enable:
      case ARC0027MethodEnum.SignTransactions:
        this._logger?.debug(
          `${LegacyUseWalletMessageBroker.displayName}#${__function}: legacy response message "${message.method}" received`
        );

        legacyResponse = this._mapLegacyResponse(message);

        // broadcast to the webpage
        if (legacyResponse) {
          this._channel.postMessage(legacyResponse);
        }
        break;
      default:
        break;
    }
  }

  /**
   * public methods
   */

  public startListening(): void {
    this._channel = new BroadcastChannel('arc0027:channel');

    // add listeners for client (web page) messages
    this._channel.onmessage = this._onClientMessage.bind(this);

    // listen to provider (extension) messages
    browser.runtime.onMessage.addListener(this._onProviderMessage.bind(this));
  }

  public stopListening(): void {
    // remove client listeners
    this._channel.close();

    // remove provider listeners
    browser.runtime.onMessage.removeListener(
      this._onProviderMessage.bind(this)
    );
  }
}
