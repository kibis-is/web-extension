import { v4 as uuid } from 'uuid';
import browser, { type Tabs } from 'webextension-polyfill';

// enums
import {
  ExternalConfigMessageReferenceEnum,
  ProviderMessageReferenceEnum,
} from '@common/enums';
import { AppTypeEnum } from '@extension/enums';

// managers
import AppWindowManager from '@extension/managers/AppWindowManager';

// messages
import BaseProviderMessage from '@common/messages/BaseProviderMessage';
import ExternalConfigOnUpdateMessage from '@common/messages/ExternalConfigOnUpdateMessage';
import ProviderThemeUpdatedMessage from '@common/messages/ProviderThemeUpdatedMessage';

// repositories
import AppWindowRepository from '@extension/repositories/AppWindowRepository';

// services
import BaseListener from '@common/services/BaseListener';

// types
import type { IBaseMessage, IBaseOptions } from '@common/types';
import type { IAppWindow } from '@extension/types';

export default class ProviderMessageHandler extends BaseListener {
  // private variables
  private readonly _appWindowRepository: AppWindowRepository;

  constructor(options: IBaseOptions) {
    super(options);

    this._appWindowRepository = new AppWindowRepository();
  }

  /**
   * private functions
   */

  private async _handleFactoryResetMessage({
    reference,
  }: BaseProviderMessage): Promise<void> {
    const _functionName = '_handleFactoryResetMessage';
    let backgroundAppWindows: IAppWindow[];
    let mainAppWindows: IAppWindow[];

    this._logger?.debug(
      `${ProviderMessageHandler.name}#${_functionName}: message "${reference}" received`
    );

    backgroundAppWindows = await this._appWindowRepository.fetchByType(
      AppTypeEnum.BackgroundApp
    );
    mainAppWindows = await this._appWindowRepository.fetchByType(
      AppTypeEnum.MainApp
    );

    // remove the main app if it exists
    if (mainAppWindows.length > 0) {
      await Promise.all(
        mainAppWindows.map(
          async (value) => await browser.windows.remove(value.windowId)
        )
      );
    }

    // remove the background apps if they exist
    if (backgroundAppWindows.length > 0) {
      await Promise.all(
        backgroundAppWindows.map(
          async (value) => await browser.windows.remove(value.windowId)
        )
      );
    }

    // remove everything from storage
    await browser.storage.local.clear();

    // proxy an update to the middlewares
    return this._sendMessageToMiddlewares(
      new ExternalConfigOnUpdateMessage({
        id: uuid(),
        reference: ExternalConfigMessageReferenceEnum.OnUpdate,
      })
    );
  }

  private async _handleRegistrationCompletedMessage({
    reference,
  }: BaseProviderMessage): Promise<void> {
    const _functionName = '_handleRegistrationCompletedMessage';
    let mainAppWindows: IAppWindow[];
    let registrationAppWindows: IAppWindow[];

    this._logger?.debug(
      `${ProviderMessageHandler.name}#${_functionName}: message "${reference}" received`
    );

    mainAppWindows = await this._appWindowRepository.fetchByType(
      AppTypeEnum.MainApp
    );
    registrationAppWindows = await this._appWindowRepository.fetchByType(
      AppTypeEnum.RegistrationApp
    );

    // if there is no main app windows, create a new one
    if (mainAppWindows.length <= 0) {
      await new AppWindowManager({
        appWindowRepository: this._appWindowRepository,
        ...(this._logger && {
          logger: this._logger,
        }),
      }).createWindow({
        type: AppTypeEnum.MainApp,
        ...(registrationAppWindows[0] && {
          left: registrationAppWindows[0].left,
          top: registrationAppWindows[0].top,
        }),
      });
    }

    // if registration app windows exist remove them
    if (registrationAppWindows.length > 0) {
      await Promise.all(
        registrationAppWindows.map(
          async (value) => await browser.windows.remove(value.windowId)
        )
      );
    }

    // proxy an update to the middlewares
    return this._sendMessageToMiddlewares(
      new ExternalConfigOnUpdateMessage({
        id: uuid(),
        reference: ExternalConfigMessageReferenceEnum.OnUpdate,
      })
    );
  }

  private async _handleThemeUpdatedMessage({
    reference,
  }: BaseProviderMessage): Promise<void> {
    const _functionName = '_handleThemeUpdatedMessage';

    this._logger?.debug(
      `${ProviderMessageHandler.name}#${_functionName}: message "${reference}" received`
    );

    // proxy an update to the middlewares
    return this._sendMessageToMiddlewares(
      new ExternalConfigOnUpdateMessage({
        id: uuid(),
        reference: ExternalConfigMessageReferenceEnum.OnUpdate,
      })
    );
  }

  private async _onProviderMessage(
    message: BaseProviderMessage
  ): Promise<void> {
    switch (message.reference) {
      case ProviderMessageReferenceEnum.FactoryReset:
        return await this._handleFactoryResetMessage(message);
      case ProviderMessageReferenceEnum.RegistrationCompleted:
        return await this._handleRegistrationCompletedMessage(message);
      case ProviderMessageReferenceEnum.ThemeUpdated:
        return await this._handleThemeUpdatedMessage(
          message as ProviderThemeUpdatedMessage
        );
      default:
        break;
    }
  }

  /**
   * Convenience method that sends a message to all the middlewares for each tab. This iterates over each message and
   * sends the message to the middleware, which can be picked up by a `ProviderMessageBroker`.
   * @param {BaseProviderMessage} message - The message to send to the middleware.
   * @private
   */
  private async _sendMessageToMiddlewares(
    message: IBaseMessage
  ): Promise<void> {
    const _functionName: string = '_sendMessageToMiddlewares';
    let tabs: Tabs.Tab[];

    this._logger?.debug(
      `${ProviderMessageHandler.name}#${_functionName}: sending "${message.reference}" message to middleware`
    );

    // get all the tabs
    tabs = await browser.tabs.query({});

    // send the message to the all the middlewares (content scripts)
    await Promise.all(
      tabs.map(
        async ({ id }) => id && (await browser.tabs.sendMessage(id, message))
      )
    );
  }

  /**
   * public functions
   */

  public startListening() {
    browser.runtime.onMessage.addListener(this._onProviderMessage.bind(this));
  }

  public stopListening() {
    browser.runtime.onMessage.removeListener(
      this._onProviderMessage.bind(this)
    );
  }
}
