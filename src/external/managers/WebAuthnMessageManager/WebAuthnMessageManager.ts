import { v4 as uuid } from 'uuid';

// errors
import { UnknownError } from '@common/errors';

// enums
import { WebAuthnMessageReferenceEnum } from '@common/enums';

// constants
import { DEFAULT_REQUEST_TIMEOUT } from '@external/constants';

// messages
import WebAuthnAccountsRequestMessage from '@common/messages/WebAuthnAccountsRequestMessage';
import WebAuthnThemeRequestMessage from '@common/messages/WebAuthnThemeRequestMessage';

// types
import type { IResult as WebAuthnAccountsResponseMessageResult } from '@common/messages/WebAuthnAccountsResponseMessage';
import type { IResult as WebAuthnThemeResponseMessageResult } from '@common/messages/WebAuthnThemeResponseMessage';
import type {
  IBaseMessage,
  IBaseOptions,
  IBaseResponseMessage,
  IExternalAccount,
  IExternalTheme,
  ILogger,
} from '@common/types';
import type { IDispatchMessageWithTimeoutOptions } from './types';

export default class WebAuthnMessageManager {
  // private variables
  private readonly _logger: ILogger | null;

  constructor({ logger }: IBaseOptions) {
    this._logger = logger || null;
  }

  /**
   * private functions
   */

  private async _dispatchMessageWithTimeout<
    Result,
    Message extends IBaseMessage<WebAuthnMessageReferenceEnum>
  >({
    delay = DEFAULT_REQUEST_TIMEOUT,
    message,
    responseReference,
  }: IDispatchMessageWithTimeoutOptions<Message>): Promise<Result | null> {
    return new Promise((resolve, reject) => {
      const _functionName = '_dispatchMessageWithTimeout';
      const listener = (event: CustomEvent<string>) => {
        let detail: IBaseResponseMessage<Result, WebAuthnMessageReferenceEnum>;

        try {
          detail = JSON.parse(event.detail); // the event.detail should be a stringified message object
        } catch (error) {
          this._logger?.debug(
            `${WebAuthnMessageManager.name}#${_functionName}:`,
            error
          );

          // clear the timeout and remove the listener - we failed to parse the message
          window.clearTimeout(timerId);
          window.removeEventListener(responseReference, listener);

          return reject(new UnknownError(error.message));
        }

        // if the request ids or the references do not match ignore - the message may be still coming
        if (
          detail.requestID !== message.id ||
          detail.reference !== responseReference
        ) {
          return;
        }

        // clear the timeout and remove the listener - we can handle it from here
        window.clearTimeout(timerId);
        window.removeEventListener(responseReference, listener);

        // if there was an error return it
        if (detail.error) {
          return reject(detail.error);
        }

        this._logger?.debug(
          `${WebAuthnMessageManager.name}#${_functionName}: received response "${detail.reference}" for request "${detail.requestID}"`
        );

        // return the result
        return resolve(detail.result);
      };
      const timerId = window.setTimeout(() => {
        // remove the listener
        window.removeEventListener(responseReference, listener);

        reject(new UnknownError(`no response from provider`));
      }, delay);

      // listen for the response
      window.addEventListener(responseReference, listener);

      // dispatch the request message
      window.dispatchEvent(
        new CustomEvent(message.reference, {
          detail: message,
        })
      );

      this._logger?.debug(
        `${WebAuthnMessageManager.name}#${_functionName}: posted webauthn request message "${message.reference}" with id "${message.id}"`
      );
    });
  }

  /**
   * public functions
   */

  public async fetchAccounts(): Promise<IExternalAccount[]> {
    const result = await this._dispatchMessageWithTimeout<
      WebAuthnAccountsResponseMessageResult,
      IBaseMessage<WebAuthnMessageReferenceEnum.AccountsRequest>
    >({
      message: new WebAuthnAccountsRequestMessage({
        id: uuid(),
        reference: WebAuthnMessageReferenceEnum.AccountsRequest,
      }),
      responseReference: WebAuthnMessageReferenceEnum.AccountsResponse,
    });

    return result?.accounts || [];
  }

  public async fetchTheme(): Promise<IExternalTheme | null> {
    const result = await this._dispatchMessageWithTimeout<
      WebAuthnThemeResponseMessageResult,
      IBaseMessage<WebAuthnMessageReferenceEnum.ThemeRequest>
    >({
      message: new WebAuthnThemeRequestMessage({
        id: uuid(),
        reference: WebAuthnMessageReferenceEnum.ThemeRequest,
      }),
      responseReference: WebAuthnMessageReferenceEnum.ThemeResponse,
    });

    return result?.theme || null;
  }
}
