import { generate as generateUUID } from '@agoralabs-sh/uuid';
import browser, { type Runtime } from 'webextension-polyfill';

// enums
import { WebAuthnMessageReferenceEnum } from '@common/enums';
import { EventTypeEnum } from '@provider/enums';

// events
import WebAuthnAuthenticateRequestEvent from '@provider/events/WebAuthnAuthenticateRequestEvent';
import WebAuthnRegisterRequestEvent from '@provider/events/WebAuthnRegisterRequestEvent';

// errors
import { WebAuthnNotEnabledError } from '@common/errors';

// messages
import WebAuthnAuthenticateRequestMessage from '@common/messages/WebAuthnAuthenticateRequestMessage';
import WebAuthnAuthenticateResponseMessage from '@common/messages/WebAuthnAuthenticateResponseMessage';
import WebAuthnRegisterRequestMessage from '@common/messages/WebAuthnRegisterRequestMessage';
import WebAuthnRegisterResponseMessage from '@common/messages/WebAuthnRegisterResponseMessage';

// message handlers
import BaseMessageHandler from '@provider/message-handlers/BaseMessageHandler';

// repository
import EventQueueRepository from '@provider/repositories/EventQueueRepository';
import SettingsRepository from '@provider/repositories/SettingsRepository';

// types
import type { IBaseOptions } from '@common/types';
import type { ISettings } from '@provider/types';

// utils
import isProviderInitialized from '@provider/utils/isProviderInitialized';
import queueProviderEvent from '@provider/utils/queueProviderEvent';
import serialize from '@provider/utils/serialize';

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

  private async _handleAuthenticateRequestMessage(
    message: WebAuthnAuthenticateRequestMessage,
    originTabID: number
  ): Promise<void> {
    const _function = '_handleAuthenticateRequestMessage';
    let isInitialized: boolean;
    let settings: ISettings;

    this._logger?.debug(`${WebAuthnMessageHandler.name}#${_function}: received message "${message.reference}"`);

    isInitialized = await isProviderInitialized();
    settings = await this._settingsRepository.fetch();

    if (!isInitialized || !settings.advanced.allowAccountPasskeys) {
      this._logger?.debug(
        `${WebAuthnMessageHandler.name}#${_function}: provider not initialized or webauthn not enabled`
      );

      await browser.tabs.sendMessage(
        originTabID,
        new WebAuthnAuthenticateResponseMessage({
          error: serialize(new WebAuthnNotEnabledError('webauthn not enabled')),
          id: generateUUID(),
          reference: WebAuthnMessageReferenceEnum.AuthenticateResponse,
          requestID: message.id,
          result: null,
        })
      );

      return;
    }

    return await this._queueProviderEvent(
      new WebAuthnAuthenticateRequestEvent({
        id: generateUUID(),
        payload: {
          message,
          originTabID,
        },
        type: EventTypeEnum.WebAuthnAuthenticateRequest,
      })
    );
  }

  private async _handleRegisterRequestMessage(
    message: WebAuthnRegisterRequestMessage,
    originTabID: number
  ): Promise<void> {
    const _function = '_handleRegisterRequestMessage';
    let isInitialized: boolean;
    let settings: ISettings;

    this._logger?.debug(`${WebAuthnMessageHandler.name}#${_function}: received message "${message.reference}"`);

    isInitialized = await isProviderInitialized();
    settings = await this._settingsRepository.fetch();

    if (!isInitialized || !settings.advanced.allowAccountPasskeys) {
      this._logger?.debug(
        `${WebAuthnMessageHandler.name}#${_function}: provider not initialized or webauthn not enabled`
      );

      await browser.tabs.sendMessage(
        originTabID,
        new WebAuthnRegisterResponseMessage({
          error: serialize(new WebAuthnNotEnabledError('webauthn not enabled')),
          id: generateUUID(),
          reference: WebAuthnMessageReferenceEnum.RegisterResponse,
          requestID: message.id,
          result: null,
        })
      );

      return;
    }

    return await this._queueProviderEvent(
      new WebAuthnRegisterRequestEvent({
        id: generateUUID(),
        payload: {
          message,
          originTabID,
        },
        type: EventTypeEnum.WebAuthnRegisterRequest,
      })
    );
  }

  private async _queueProviderEvent<Event extends WebAuthnAuthenticateRequestEvent | WebAuthnRegisterRequestEvent>(
    event: Event
  ): Promise<void> {
    const _function = '_queueProviderEvent';
    const events = await this._eventQueueRepository.fetchByType<Event>(event.type);

    // if the client request already exists, ignore it
    if (events.find((value) => value.payload.message.id === event.payload.message.id)) {
      this._logger?.debug(
        `${WebAuthnMessageHandler.name}#${_function}: client request "${event.payload.message.id}" already exists, ignoring`
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

  protected async _onMiddlewareMessage(
    message: WebAuthnAuthenticateRequestMessage | WebAuthnRegisterRequestMessage,
    sender: Runtime.MessageSender
  ): Promise<void> {
    const _function = '_onMiddlewareMessage';

    if (!sender.tab?.id) {
      this._logger?.debug(
        `${WebAuthnMessageHandler.name}#${_function}: unknown sender for "${message.reference}" message, ignoring`
      );

      return;
    }

    switch (message.reference) {
      case WebAuthnMessageReferenceEnum.AuthenticateRequest:
        await this._handleAuthenticateRequestMessage(message, sender.tab.id);
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
    browser.runtime.onMessage.addListener(this._onMiddlewareMessage.bind(this));
  }

  public stopListening(): void {
    browser.runtime.onMessage.removeListener(this._onMiddlewareMessage.bind(this));
  }
}
