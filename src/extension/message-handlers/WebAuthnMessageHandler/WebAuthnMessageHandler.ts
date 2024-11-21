import { v4 as uuid } from 'uuid';
import browser, { type Runtime } from 'webextension-polyfill';

// enums
import { EventTypeEnum } from '@extension/enums';

// events
import { WebAuthnRequestEvent } from '@extension/events';

// messages
import {
  WebAuthnCreateRequestMessage,
  WebAuthnGetRequestMessage,
} from '@common/messages';

// repository
import EventQueueRepository from '@extension/repositories/EventQueueRepository';

// services
import BaseListener from '@common/services/BaseListener';

// types
import type { IBaseOptions } from '@common/types';

// utils
import sendExtensionEvent from '@extension/utils/sendExtensionEvent';

export default class WebAuthnMessageHandler extends BaseListener {
  // private variables
  private readonly _eventQueueRepository: EventQueueRepository;

  constructor(options: IBaseOptions) {
    super(options);

    this._eventQueueRepository = new EventQueueRepository();
  }

  /**
   * private methods
   */

  private async _onMessage(
    message: WebAuthnCreateRequestMessage | WebAuthnGetRequestMessage,
    sender: Runtime.MessageSender
  ): Promise<void> {
    const _functionName = '_onMessage';
    let event: WebAuthnRequestEvent;
    let events: WebAuthnRequestEvent[];

    this._logger?.debug(
      `${WebAuthnMessageHandler.name}#${_functionName}: received client message "${message.reference}" with id "${message.id}"`
    );

    if (!sender.tab?.id) {
      this._logger?.debug(
        `${WebAuthnMessageHandler.name}#${_functionName}: unknown sender for "${message.reference}" message, ignoring`
      );

      return;
    }

    events = await this._eventQueueRepository.fetchByType<WebAuthnRequestEvent>(
      EventTypeEnum.WebAuthnRequest
    );

    // if the client request already exists, ignore it
    if (
      events.find(
        (value) => value.payload.message.id === event.payload.message.id
      )
    ) {
      this._logger?.debug(
        `${WebAuthnMessageHandler.name}#${_functionName}: webauthn request "${message.id}" already exists, ignoring`
      );

      return;
    }

    return await sendExtensionEvent({
      event: new WebAuthnRequestEvent({
        id: uuid(),
        payload: {
          message,
          originTabId: sender.tab.id,
        },
      }),
      eventQueueRepository: this._eventQueueRepository,
      ...(this._logger && {
        logger: this._logger,
      }),
    });
  }

  /**
   * public methods
   */

  public startListening(): void {
    browser.runtime.onMessage.addListener(this._onMessage.bind(this));
  }

  public stopListening(): void {
    browser.runtime.onMessage.removeListener(this._onMessage.bind(this));
  }
}
