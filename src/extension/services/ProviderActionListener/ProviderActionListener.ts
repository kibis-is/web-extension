import { generate as generateUUID } from '@agoralabs-sh/uuid';
import { TransactionType } from 'algosdk';
import browser, { Alarms, Tabs, Windows } from 'webextension-polyfill';

// configs
import { networks } from '@extension/config';

// constants
import { CREDENTIAL_LOCK_ALARM } from '@extension/constants';

// enums
import {
  AppTypeEnum,
  ARC0300AuthorityEnum,
  ARC0300PathEnum,
  EventTypeEnum,
} from '@extension/enums';

// events
import ARC0300KeyRegistrationTransactionSendEvent from '@extension/events/ARC0300KeyRegistrationTransactionSendEvent';

// managers
import AppWindowManager from '@extension/managers/AppWindowManager';

// messages
import ProviderCredentialLockActivatedMessage from '@common/messages/ProviderCredentialLockActivatedMessage';

// repositories
import AppWindowRepository from '@extension/repositories/AppWindowRepository';
import PrivateKeyRepository from '@extension/repositories/PrivateKeyRepository';
import SettingsRepository from '@extension/repositories/SettingsRepository';
import SystemInfoRepository from '@extension/repositories/SystemInfoRepository';

// services
import BaseListener from '@common/services/BaseListener';
import CredentialLockService from '../CredentialLockService';

// types
import type { IBaseOptions } from '@common/types';
import {
  IAppWindow,
  IARC0300BaseSchema,
  IARC0300OfflineKeyRegistrationTransactionSendSchema,
  IARC0300OnlineKeyRegistrationTransactionSendSchema,
  ISettings,
  TARC0300TransactionSendSchemas,
} from '@extension/types';

// utils
import isProviderInitialized from '@extension/utils/isProviderInitialized';
import parseURIToARC0300Schema from '@extension/utils/parseURIToARC0300Schema';
import queueProviderEvent from '@extension/utils/queueProviderEvent';
import supportedNetworksFromSettings from '@extension/utils/supportedNetworksFromSettings';

export default class ProviderActionListener extends BaseListener {
  // private variables
  private readonly _appWindowManager: AppWindowManager;
  private readonly _appWindowRepository: AppWindowRepository;
  private readonly _credentialLockService: CredentialLockService;
  private _isClearingCredentialLockAlarm: boolean;
  private _isRestartingCredentialLockAlarm: boolean;
  private readonly _privateKeyRepository: PrivateKeyRepository;
  private readonly _settingsRepository: SettingsRepository;
  private readonly _systemInfoRepository: SystemInfoRepository;

  constructor(options: IBaseOptions) {
    const appWindowRepository = new AppWindowRepository();

    super(options);

    this._appWindowManager = new AppWindowManager({
      appWindowRepository,
      logger: options.logger,
    });
    this._appWindowRepository = appWindowRepository;
    this._isClearingCredentialLockAlarm = false;
    this._isRestartingCredentialLockAlarm = false;
    this._credentialLockService = new CredentialLockService({
      logger: options.logger,
    });
    this._privateKeyRepository = new PrivateKeyRepository();
    this._settingsRepository = new SettingsRepository();
    this._systemInfoRepository = new SystemInfoRepository();
  }

  /**
   * private functions
   */

  private async _clearCredentialLockAlarm(): Promise<void> {
    let alarm = await this._credentialLockService.getAlarm();

    // clear the alarm if the credential lock alarm
    if (!alarm || !this._isClearingCredentialLockAlarm) {
      this._isClearingCredentialLockAlarm = true;

      await this._credentialLockService.clearAlarm();

      this._isClearingCredentialLockAlarm = false;
    }
  }

  private async _getMainWindow(
    includeTabs: boolean = false
  ): Promise<Windows.Window | null> {
    const mainAppWindows = await this._appWindowRepository.fetchByType(
      AppTypeEnum.MainApp
    );

    if (mainAppWindows.length <= 0) {
      return null;
    }

    return (
      (await browser.windows.get(mainAppWindows[0].windowId, {
        populate: includeTabs,
      })) || null
    );
  }

  private async _getMainWindowTab(): Promise<Tabs.Tab | null> {
    const mainWindow = await this._getMainWindow(true);

    if (!mainWindow) {
      return null;
    }

    return mainWindow.tabs?.[0] ?? null;
  }

  private async _handleCredentialLockActivated(): Promise<void> {
    const _functionName = '_handleCredentialLockActivated';
    const privateKeyItems = await this._privateKeyRepository.fetchAll();

    // remove all the decrypted private keys
    await this._privateKeyRepository.saveMany(
      privateKeyItems.map((value) => ({
        ...value,
        privateKey: null,
      }))
    );

    this._logger?.debug(
      `${ProviderActionListener.name}#${_functionName}: removed decrypted private keys`
    );

    // send a message to the popups to lock the screen
    await browser.runtime.sendMessage(
      new ProviderCredentialLockActivatedMessage()
    );
  }

  private async _onAlarm(alarm: Alarms.Alarm): Promise<void> {
    const _functionName = 'onAlarm';

    this._logger?.debug(
      `${ProviderActionListener.name}#${_functionName}: alarm "${alarm.name}" fired`
    );

    switch (alarm.name) {
      case CREDENTIAL_LOCK_ALARM:
        await this._handleCredentialLockActivated();

        break;
      default:
        break;
    }
  }

  private async _onExtensionClick(): Promise<void> {
    const _functionName = 'onExtensionClick';
    const isInitialized = await isProviderInitialized();
    let mainAppWindows: IAppWindow[];
    let registrationAppWindows: IAppWindow[];

    this._logger?.debug(
      `${ProviderActionListener.name}#${_functionName}: browser extension clicked`
    );

    // remove any closed windows
    await this._appWindowManager.hydrate();

    if (!isInitialized) {
      registrationAppWindows = await this._appWindowRepository.fetchByType(
        AppTypeEnum.RegistrationApp
      );

      // if there is a registration app window open, bring it to focus
      if (registrationAppWindows.length > 0) {
        this._logger?.debug(
          `${ProviderActionListener.name}#${_functionName}: no account detected and previous registration app window "${registrationAppWindows[0].windowId}" already open, bringing to focus`
        );

        await browser.windows.update(registrationAppWindows[0].windowId, {
          focused: true,
        });

        return;
      }

      this._logger?.debug(
        `${ProviderActionListener.name}#${_functionName}: no account detected and no main app window open, creating an new one`
      );

      // remove everything from storage
      await browser.storage.local.clear();

      // if there is no registration app window up, we can open a new one
      await this._appWindowManager.createWindow({
        type: AppTypeEnum.RegistrationApp,
      });

      return;
    }

    mainAppWindows = await this._appWindowRepository.fetchByType(
      AppTypeEnum.MainApp
    );

    // if there is a main app window open, bring it to focus
    if (mainAppWindows.length > 0) {
      this._logger?.debug(
        `${ProviderActionListener.name}#${_functionName}: previous account detected and previous main app window "${mainAppWindows[0].windowId}" already open, bringing to focus`
      );

      await browser.windows.update(mainAppWindows[0].windowId, {
        focused: true,
      });

      return;
    }

    this._logger?.debug(
      `${ProviderActionListener.name}#${_functionName}: previous account detected and no main app window open, creating an new one`
    );

    // if there is no main app window up, we can open the app and clear the credentials lock alarm
    await this._appWindowManager.createWindow({
      type: AppTypeEnum.MainApp,
    });
    await this._clearCredentialLockAlarm();
  }

  private async _onFocusChanged(windowId: number): Promise<void> {
    const _functionName = '_onFocusChanged';
    const mainWindow = await this._getMainWindow();

    if (mainWindow) {
      if (windowId === mainWindow.id) {
        this._logger?.debug(
          `${ProviderActionListener.name}#${_functionName}: main window with id "${windowId}" has focus`
        );

        await this._clearCredentialLockAlarm();

        return;
      }

      this._logger?.debug(
        `${ProviderActionListener.name}#${_functionName}: main window has lost focus to window with id "${windowId}"`
      );

      await this._restartCredentialLockAlarm();
    }
  }

  private async _onInstalled(): Promise<void> {
    const _functionName = '_onInstalled';
    let systemInfo = await this._systemInfoRepository.fetch();

    // if there is no system info, initialize the default
    if (!systemInfo) {
      systemInfo = SystemInfoRepository.initializeDefaultSystem();

      this._logger?.debug(
        `${ProviderActionListener.name}#${_functionName}: initialize a new system info with device id "${systemInfo.deviceID}"`
      );

      await this._systemInfoRepository.save(systemInfo);
    }
  }

  private async _onOmniboxInputEntered(text: string): Promise<void> {
    const _functionName = '_onOmniboxInputEntered';
    let arc0300Schema: IARC0300BaseSchema | null;

    this._logger?.debug(
      `${ProviderActionListener.name}#${_functionName}: received omnibox input "${text}"`
    );

    arc0300Schema = parseURIToARC0300Schema(text, {
      supportedNetworks: supportedNetworksFromSettings({
        networks,
        settings: await this._settingsRepository.fetch(),
      }),
      ...(this._logger && {
        logger: this._logger,
      }),
    });

    if (arc0300Schema) {
      switch (arc0300Schema.authority) {
        case ARC0300AuthorityEnum.Transaction:
          // send
          if (arc0300Schema.paths[0] === ARC0300PathEnum.Send) {
            switch (
              (arc0300Schema as TARC0300TransactionSendSchemas).query.type
            ) {
              case TransactionType.keyreg:
                return await queueProviderEvent({
                  appWindowRepository: this._appWindowRepository,
                  event: new ARC0300KeyRegistrationTransactionSendEvent({
                    id: generateUUID(),
                    payload: arc0300Schema as
                      | IARC0300OfflineKeyRegistrationTransactionSendSchema
                      | IARC0300OnlineKeyRegistrationTransactionSendSchema,
                    type: EventTypeEnum.ARC0300KeyRegistrationTransactionSend,
                  }),
                  ...(this._logger && {
                    logger: this._logger,
                  }),
                });
              default:
                break;
            }
          }

          break;
        default:
          break;
      }
    }
  }

  private async _onWindowRemove(windowId: number): Promise<void> {
    const _functionName = '_onWindowRemove';
    const appWindow = await this._appWindowRepository.fetchById(windowId);

    // remove the app window from storage
    if (appWindow) {
      this._logger?.debug(
        `${ProviderActionListener.name}#${_functionName}: removed "${appWindow.type}" window`
      );

      if (appWindow.type === AppTypeEnum.MainApp) {
        await this._restartCredentialLockAlarm();
      }

      await this._appWindowRepository.removeByIds([windowId]);
    }
  }

  private async _restartCredentialLockAlarm(): Promise<void> {
    let alarm = await this._credentialLockService.getAlarm();
    let settings: ISettings = await this._settingsRepository.fetch();

    // restart the alarm if the credential lock is not active, is enabled and the duration is not set to 0 ("never")
    if (
      !this._isRestartingCredentialLockAlarm &&
      !alarm &&
      settings.security.enableCredentialLock &&
      settings.security.credentialLockTimeoutDuration > 0
    ) {
      this._isRestartingCredentialLockAlarm = true;

      await this._credentialLockService.restartAlarm(
        settings.security.credentialLockTimeoutDuration
      );

      this._isRestartingCredentialLockAlarm = false;
    }
  }

  /**
   * public functions
   */

  public startListening(): void {
    const browserAction = browser.action || browser.browserAction; // TODO: use browser.action for v3

    browser.alarms.onAlarm.addListener(this._onAlarm.bind(this));
    browserAction.onClicked.addListener(this._onExtensionClick.bind(this));
    browser.omnibox.onInputEntered.addListener(
      this._onOmniboxInputEntered.bind(this)
    );
    browser.runtime.onInstalled.addListener(this._onInstalled.bind(this));
    browser.windows.onFocusChanged.addListener(this._onFocusChanged.bind(this));
    browser.windows.onRemoved.addListener(this._onWindowRemove.bind(this));
  }

  public stopListening() {
    const browserAction = browser.action || browser.browserAction; // TODO: use browser.action for v3

    browser.alarms.onAlarm.removeListener(this._onAlarm.bind(this));
    browserAction.onClicked.removeListener(this._onExtensionClick.bind(this));
    browser.omnibox.onInputEntered.removeListener(
      this._onOmniboxInputEntered.bind(this)
    );
    browser.runtime.onInstalled.removeListener(this._onInstalled.bind(this));
    browser.windows.onFocusChanged.removeListener(
      this._onFocusChanged.bind(this)
    );
    browser.windows.onRemoved.removeListener(this._onWindowRemove.bind(this));
  }
}
