import browser from 'webextension-polyfill';

// enums
import { ProviderMessageReferenceEnum } from '@common/enums';
import { AppTypeEnum } from '@extension/enums';

// managers
import AppWindowManager from '@extension/managers/AppWindowManager';

// messages
import { BaseProviderMessage } from '@common/messages';

// repositories
import AppWindowRepository from '@extension/repositories/AppWindowRepository';

// services
import BaseListener from '@common/services/BaseListener';

// types
import type { IBaseOptions } from '@common/types';
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
  }

  private async _onMessage(message: BaseProviderMessage): Promise<void> {
    switch (message.reference) {
      case ProviderMessageReferenceEnum.FactoryReset:
        return await this._handleFactoryResetMessage(message);
      case ProviderMessageReferenceEnum.RegistrationCompleted:
        return await this._handleRegistrationCompletedMessage(message);
      default:
        break;
    }
  }

  /**
   * public functions
   */

  public startListening() {
    browser.runtime.onMessage.addListener(this._onMessage.bind(this));
  }

  public stopListening() {
    browser.runtime.onMessage.removeListener(this._onMessage.bind(this));
  }
}
