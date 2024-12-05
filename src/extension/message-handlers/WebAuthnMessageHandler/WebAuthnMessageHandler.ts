import { v4 as uuid } from 'uuid';
import browser, { type Runtime } from 'webextension-polyfill';

// enums
import { WebAuthnMessageReferenceEnum } from '@common/enums';
import { EventTypeEnum } from '@extension/enums';

// events
import WebAuthnRegisterRequestEvent from '@extension/events/WebAuthnRegisterRequestEvent';

// messages
import WebAuthnConfigRequestMessage from '@common/messages/WebAuthnConfigRequestMessage';
import WebAuthnConfigResponseMessage from '@common/messages/WebAuthnConfigResponseMessage';
import WebAuthnRegisterRequestMessage from '@common/messages/WebAuthnRegisterRequestMessage';

// repository
import EventQueueRepository from '@extension/repositories/EventQueueRepository';
import SettingsRepository from '@extension/repositories/SettingsRepository';

// message handlers
import BaseMessageHandler from '@extension/message-handlers/BaseMessageHandler';

// types
import type { IBaseOptions } from '@common/types';
import type { ISettings } from '@extension/types';

// utils
import isProviderInitialized from '@extension/utils/isProviderInitialized';
import queueProviderEvent from '@extension/utils/queueProviderEvent';

export default class WebAuthnMessageHandler extends BaseMessageHandler {
  // private variables
  private readonly _eventQueueRepository: EventQueueRepository;
  private readonly _settingsRepository: SettingsRepository;

  constructor(options: IBaseOptions) {
    super(options);

    this._eventQueueRepository = new EventQueueRepository();
    this._settingsRepository = new SettingsRepository();
  }

  /**
   * private methods
   */

  private async _handleConfigRequestMessage(
    message: WebAuthnConfigRequestMessage,
    originTabID: number
  ): Promise<void> {
    const _functionName = '_handleConfigRequestMessage';
    let settings: ISettings;

    this._logger?.debug(
      `${WebAuthnMessageHandler.name}#${_functionName}: received message "${message.reference}"`
    );

    settings = await this._settingsRepository.fetch();

    // send a response with all accounts
    return this._sendResponseToMiddleware(
      new WebAuthnConfigResponseMessage({
        error: null,
        id: uuid(),
        reference: WebAuthnMessageReferenceEnum.ConfigResponse,
        requestID: message.id,
        result: {
          config: {
            debugLogging: settings.advanced.debugLogging,
            isInitialized: await isProviderInitialized(),
            theme: {
              colorMode: settings.appearance.theme,
              font: settings.appearance.font,
            },
          },
        },
      }),
      originTabID
    );
  }

  private async _handleRegisterRequestMessage(
    message: WebAuthnRegisterRequestMessage,
    originTabID: number
  ): Promise<void> {
    const _functionName = '_handleRegisterRequestMessage';

    this._logger?.debug(
      `${WebAuthnMessageHandler.name}#${_functionName}: received message "${message.reference}"`
    );

    return await this._queueProviderEvent(
      new WebAuthnRegisterRequestEvent({
        id: uuid(),
        payload: {
          message,
          originTabID,
        },
        type: EventTypeEnum.WebAuthnRegisterRequest,
      })
    );
  }

  private async _queueProviderEvent<Event extends WebAuthnRegisterRequestEvent>(
    event: Event
  ): Promise<void> {
    const _functionName = '_queueProviderEvent';
    const events = await this._eventQueueRepository.fetchByType<Event>(
      event.type
    );

    // if the client request already exists, ignore it
    if (
      events.find(
        (value) => value.payload.message.id === event.payload.message.id
      )
    ) {
      this._logger?.debug(
        `${WebAuthnMessageHandler.name}#${_functionName}: client request "${event.payload.message.id}" already exists, ignoring`
      );

      return;
    }

    return await queueProviderEvent({
      event,
      eventQueueRepository: this._eventQueueRepository,
      ...(this._logger && {
        logger: this._logger,
      }),
    });
  }

  /**
   * protected methods
   */

  protected async _onMessage(
    message: WebAuthnRegisterRequestMessage | WebAuthnConfigRequestMessage,
    sender: Runtime.MessageSender
  ): Promise<void> {
    const _functionName = '_onMessage';

    if (!sender.tab?.id) {
      this._logger?.debug(
        `${WebAuthnMessageHandler.name}#${_functionName}: unknown sender for "${message.reference}" message, ignoring`
      );

      return;
    }

    switch (message.reference) {
      case WebAuthnMessageReferenceEnum.ConfigRequest:
        await this._handleConfigRequestMessage(message, sender.tab.id);
        break;
      case WebAuthnMessageReferenceEnum.RegisterRequest:
        await this._handleRegisterRequestMessage(message, sender.tab.id);
        break;
      default:
        break;
    }
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
