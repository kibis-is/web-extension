import browser from 'webextension-polyfill';

// enums
import { WebAuthnMessageReferenceEnum } from '@common/enums';

// services
import BaseListener from '@common/services/BaseListener';

// types
import { IBaseMessage, IBaseResponseMessage } from '@common/types';

/**
 * The WebAuthn message broker listens to messages from the client (the `WebAuthnMessageManager` that is injected in the
 * webpage via `webauthn.js`) and the provider (background script/popup) and transfers the messages between the two.
 */
export default class WebAuthnMessageBroker extends BaseListener {
  // private variables
  private readonly _clientRequestReferences: WebAuthnMessageReferenceEnum[] = [
    WebAuthnMessageReferenceEnum.RegisterRequest,
    WebAuthnMessageReferenceEnum.ThemeRequest,
  ];

  /**
   * private methods
   */

  private _onClientMessage(
    message: CustomEvent<IBaseMessage<WebAuthnMessageReferenceEnum>>
  ) {
    const _functionName = '_onClientMessage';

    this._logger?.debug(
      `${WebAuthnMessageBroker.name}#${_functionName}: received client message "${message.detail.reference}" with id "${message.detail.id}"`
    );

    // proxy message to the provider
    browser.runtime.sendMessage(message.detail);
  }

  private _onProviderMessage(
    message: IBaseResponseMessage<
      IBaseMessage<WebAuthnMessageReferenceEnum>,
      WebAuthnMessageReferenceEnum
    >
  ): void {
    const _functionName = '_onProviderMessage';

    this._logger?.debug(
      `${WebAuthnMessageBroker.name}#${_functionName}: received provider message "${message.reference}" with id "${message.id}"`
    );

    // proxy message to the client
    window.dispatchEvent(
      new CustomEvent(message.reference, {
        detail: JSON.stringify(message), // the message needs to be serialized as webpages do not allow anything but strings
      })
    );
  }

  /**
   * public methods
   */

  public startListening(): void {
    // add listeners for client (web page) messages
    this._clientRequestReferences.forEach((reference) =>
      window.addEventListener(reference, this._onClientMessage.bind(this))
    );

    // listen to provider (extension) messages
    browser.runtime.onMessage.addListener(this._onProviderMessage.bind(this));
  }

  public stopListening(): void {
    // remove client listeners
    this._clientRequestReferences.forEach((reference) =>
      window.removeEventListener(reference, this._onClientMessage.bind(this))
    );

    // remove provider listeners
    browser.runtime.onMessage.removeListener(
      this._onProviderMessage.bind(this)
    );
  }
}
