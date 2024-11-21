import browser, { type Runtime } from 'webextension-polyfill';

// enums
import { WebAuthnMessageReferenceEnum } from '@common/enums';

// messages
import {
  WebAuthnCreateRequestMessage,
  WebAuthnCreateResponseMessage,
  WebAuthnGetRequestMessage,
  WebAuthnGetResponseMessage,
} from '@common/messages';

// repository
import EventQueueRepository from '@extension/repositories/EventQueueRepository';

// types
import type { IBaseOptions, ILogger } from '@common/types';

export default class WebAuthnMessageHandler {
  // private variables
  private readonly _eventQueueRepository: EventQueueRepository;
  private readonly _logger: ILogger | null;

  constructor({ logger }: IBaseOptions) {
    this._eventQueueRepository = new EventQueueRepository();
    this._logger = logger || null;
  }

  /**
   * private methods
   */

  private _onMessage(
    message: WebAuthnCreateRequestMessage | WebAuthnGetRequestMessage,
    sender: Runtime.MessageSender
  ): void {
    const _functionName = '_onMessage';

    this._logger?.debug(
      `${WebAuthnMessageHandler.name}#${_functionName}: received client message "${message.reference}" with id "${message.id}"`
    );

    if (!sender.tab?.id) {
      this._logger?.debug(
        `${WebAuthnMessageHandler.name}#${_functionName}: unknown sender for "${message.reference}" message, ignoring`
      );

      return;
    }
  }

  /**
   * public methods
   */

  public startListening(): void {
    // listen to messages from the webauthn broker (content-script)
    browser.runtime.onMessage.addListener(this._onMessage.bind(this));
  }

  public stopListening(): void {
    // remove listeners
    browser.runtime.onMessage.removeListener(this._onMessage.bind(this));
  }
}
