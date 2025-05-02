import browser from 'webextension-polyfill';

// messages
import BaseProviderMessage from '@common/messages/BaseProviderMessage';

// services
import BaseListener from '@common/services/BaseListener';

/**
 * The provider message broker listens to messages from the provider (background script/popup) and transfers the
 * messages to the client.
 *
 * This broker is mono-directional: `Provider -> Middleware -> Client`
 */
export default class ProviderMessageBroker extends BaseListener {
  /**
   * private methods
   */

  private _onProviderMessage(message: BaseProviderMessage): void {
    const _functionName = '_onProviderMessage';

    this._logger?.debug(
      `${ProviderMessageBroker.name}#${_functionName}: received provider message "${message.reference}" with id "${message.id}"`
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
    // listen to provider (extension) messages
    browser.runtime.onMessage.addListener(this._onProviderMessage.bind(this));
  }

  public stopListening(): void {
    // remove provider listeners
    browser.runtime.onMessage.removeListener(
      this._onProviderMessage.bind(this)
    );
  }
}
