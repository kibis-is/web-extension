import { v4 as uuid } from 'uuid';
import browser, { type Runtime } from 'webextension-polyfill';

// enums
import { WebAuthnMessageReferenceEnum } from '@common/enums';

// messages
import WebAuthnAccountsRequestMessage from '@common/messages/WebAuthnAccountsRequestMessage';
import WebAuthnAccountsResponseMessage from '@common/messages/WebAuthnAccountsResponseMessage';
import WebAuthnRegisterRequestMessage from '@common/messages/WebAuthnRegisterRequestMessage';
import WebAuthnRegisterResponseMessage from '@common/messages/WebAuthnRegisterResponseMessage';
import WebAuthnThemeRequestMessage from '@common/messages/WebAuthnThemeRequestMessage';
import WebAuthnThemeResponseMessage from '@common/messages/WebAuthnThemeResponseMessage';

// repository
import AccountRepository from '@extension/repositories/AccountRepository';
import SettingsRepository from '@extension/repositories/SettingsRepository';

// message handlers
import BaseMessageHandler from '@extension/message-handlers/BaseMessageHandler';

// types
import type { IBaseOptions, IExternalAccount } from '@common/types';
import type { IAccount, ISettings } from '@extension/types';

// utils
import isWatchAccount from '@extension/utils/isWatchAccount';
import { AuthInvalidPublicKeyError } from '@common/errors';

export default class WebAuthnMessageHandler extends BaseMessageHandler {
  // private variables
  private readonly _accountRepository: AccountRepository;
  private readonly _settingsRepository: SettingsRepository;

  constructor(options: IBaseOptions) {
    super(options);

    this._accountRepository = new AccountRepository();
    this._settingsRepository = new SettingsRepository();
  }

  /**
   * private methods
   */

  private async _handleAccountsRequestMessage(
    message: WebAuthnAccountsRequestMessage,
    originTabID: number
  ): Promise<void> {
    const _functionName = '_handleAccountsRequestMessage';
    let _accounts: IAccount[];
    let accounts: IExternalAccount[] = [];

    this._logger?.debug(
      `${WebAuthnMessageHandler.name}#${_functionName}: received message "${message.reference}"`
    );

    _accounts = await this._accountRepository.fetchAll();

    for (const account of _accounts) {
      accounts.push({
        watchAccount: await isWatchAccount(account),
        publicKey: account.publicKey,
        ...(account.color && {
          color: account.color,
        }),
        ...(account.icon && {
          icon: account.icon,
        }),
        ...(account.name && {
          name: account.name,
        }),
      });
    }

    // send a response with all accounts
    return this._sendResponseToMiddleware(
      new WebAuthnAccountsResponseMessage({
        error: null,
        id: uuid(),
        reference: WebAuthnMessageReferenceEnum.AccountsResponse,
        requestID: message.id,
        result: {
          accounts,
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
    let account: IAccount | null;

    this._logger?.debug(
      `${WebAuthnMessageHandler.name}#${_functionName}: received message "${message.reference}"`
    );

    account = await this._accountRepository.fetchByPublicKey(
      message.payload.publicKey
    );

    if (!account) {
      return this._sendResponseToMiddleware(
        new WebAuthnRegisterResponseMessage({
          error: new AuthInvalidPublicKeyError(
            `public key for account not found`
          ),
          id: uuid(),
          reference: WebAuthnMessageReferenceEnum.RegisterResponse,
          requestID: message.id,
          result: null,
        }),
        originTabID
      );
    }

    // TODO: create passkey and send back data
  }

  private async _handleThemeRequestMessage(
    message: WebAuthnThemeRequestMessage,
    originTabID: number
  ): Promise<void> {
    const _functionName = '_handleThemeRequestMessage';
    let settings: ISettings;

    this._logger?.debug(
      `${WebAuthnMessageHandler.name}#${_functionName}: received message "${message.reference}"`
    );

    settings = await this._settingsRepository.fetch();

    // send a response with all accounts
    return this._sendResponseToMiddleware(
      new WebAuthnThemeResponseMessage({
        error: null,
        id: uuid(),
        reference: WebAuthnMessageReferenceEnum.ThemeResponse,
        requestID: message.id,
        result: {
          theme: {
            colorMode: settings.appearance.theme,
            font: settings.appearance.font,
          },
        },
      }),
      originTabID
    );
  }

  /**
   * protected methods
   */

  protected async _onMessage(
    message: WebAuthnAccountsRequestMessage | WebAuthnThemeRequestMessage,
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
      case WebAuthnMessageReferenceEnum.AccountsRequest:
        await this._handleAccountsRequestMessage(message, sender.tab.id);
        break;
      case WebAuthnMessageReferenceEnum.ThemeRequest:
        await this._handleThemeRequestMessage(message, sender.tab.id);
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
