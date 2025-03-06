import { generate as generateUUID } from '@agoralabs-sh/uuid';
import browser, { type Runtime } from 'webextension-polyfill';

// enums
import { ExternalConfigMessageReferenceEnum } from '@common/enums';

// messages
import ExternalConfigRequestMessage from '@common/messages/ExternalConfigRequestMessage';
import ExternalConfigResponseMessage from '@common/messages/ExternalConfigResponseMessage';

// repository
import SettingsRepository from '@extension/repositories/SettingsRepository';

// message handlers
import BaseMessageHandler from '@extension/message-handlers/BaseMessageHandler';

// types
import type { IBaseOptions } from '@common/types';
import type { ISettings } from '@extension/types';

// utils
import isProviderInitialized from '@extension/utils/isProviderInitialized';

export default class ExternalConfigMessageHandler extends BaseMessageHandler {
  // private variables
  private readonly _settingsRepository: SettingsRepository;

  constructor(options: IBaseOptions) {
    super(options);

    this._settingsRepository = new SettingsRepository();
  }

  /**
   * private methods
   */

  private async _handleConfigRequestMessage(
    message: ExternalConfigRequestMessage,
    originTabID: number
  ): Promise<void> {
    const _functionName = '_handleConfigRequestMessage';
    let settings: ISettings;

    this._logger?.debug(
      `${ExternalConfigMessageHandler.name}#${_functionName}: received message "${message.reference}"`
    );

    settings = await this._settingsRepository.fetch();

    // send a response with all accounts
    return this._sendResponseToMiddleware(
      new ExternalConfigResponseMessage({
        error: null,
        id: generateUUID(),
        reference: ExternalConfigMessageReferenceEnum.Response,
        requestID: message.id,
        result: {
          config: {
            allowAccountPasskeys: settings.advanced.allowAccountPasskeys,
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

  /**
   * protected methods
   */

  protected async _onMiddlewareMessage(
    message: ExternalConfigRequestMessage,
    sender: Runtime.MessageSender
  ): Promise<void> {
    const _functionName = '_onMessage';

    if (!sender.tab?.id) {
      this._logger?.debug(
        `${ExternalConfigMessageHandler.name}#${_functionName}: unknown sender for "${message.reference}" message, ignoring`
      );

      return;
    }

    switch (message.reference) {
      case ExternalConfigMessageReferenceEnum.Request:
        await this._handleConfigRequestMessage(message, sender.tab.id);
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
    browser.runtime.onMessage.removeListener(
      this._onMiddlewareMessage.bind(this)
    );
  }
}
