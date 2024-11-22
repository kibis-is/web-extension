import browser from 'webextension-polyfill';

// enums
import { WebAuthnMessageReferenceEnum } from '@common/enums';

// messages
import {
  WebAuthnCreateRequestMessage,
  WebAuthnCreateResponseMessage,
  WebAuthnGetRequestMessage,
  WebAuthnGetResponseMessage,
} from '@common/messages';

// services
import BaseListener from '@common/services/BaseListener';

/**
 * The WebAuthn message broker listens to messages the client (the `WebAuthnManager` that is injected in the webpage via
 * `webauthn-manager.js`) and the provider (background script/popup) and transfers the messages between the two.
 */
export default class WebAuthnMessageBroker extends BaseListener {
  /**
   * private methods
   */

  private _onClientMessage(
    reference: WebAuthnMessageReferenceEnum,
    message: CustomEvent<
      WebAuthnCreateRequestMessage | WebAuthnGetRequestMessage
    >
  ) {
    const _functionName = '_onClientMessage';

    this._logger?.debug(
      `${WebAuthnMessageBroker.name}#${_functionName}: received client message "${reference}" with id "${message.detail.id}"`
    );

    // send message to provider
    browser.runtime.sendMessage(message.detail);
  }

  private _onProviderMessage(
    message: WebAuthnCreateResponseMessage | WebAuthnGetResponseMessage
  ): void {
    const _functionName = '_onProviderMessage';

    this._logger?.debug(
      `${WebAuthnMessageBroker.name}#${_functionName}: received provider message "${message.reference}" with id "${message.id}"`
    );

    // dispatch message to the client
    window.dispatchEvent(
      new CustomEvent(message.reference, {
        detail: JSON.stringify(message), // the message needs to be serialized
      })
    );
  }

  /**
   * public methods
   */

  public startListening(): void {
    // listen to client messages
    [
      WebAuthnMessageReferenceEnum.CreateRequest,
      WebAuthnMessageReferenceEnum.GetRequest,
    ].forEach((reference) =>
      window.addEventListener(
        reference,
        this._onClientMessage.bind(this, reference)
      )
    );

    // listen to provider messages
    browser.runtime.onMessage.addListener(this._onProviderMessage.bind(this));
  }

  public stopListening(): void {
    // remove client listeners
    [
      WebAuthnMessageReferenceEnum.CreateRequest,
      WebAuthnMessageReferenceEnum.GetRequest,
    ].forEach((reference) =>
      window.removeEventListener(
        reference,
        this._onClientMessage.bind(this, reference)
      )
    );

    // remove provider listeners
    browser.runtime.onMessage.removeListener(
      this._onProviderMessage.bind(this)
    );
  }
}
