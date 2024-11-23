import { v4 as uuid } from 'uuid';
import browser, { type Runtime } from 'webextension-polyfill';

// enums
import { WebAuthnMessageReferenceEnum } from '@common/enums';

// events

// messages
import WebAuthnAccountsRequestMessage from '@common/messages/WebAuthnAccountsRequestMessage';
import WebAuthnAccountsResponseMessage from '@common/messages/WebAuthnAccountsResponseMessage';

// repository
import AccountRepository from '@extension/repositories/AccountRepository';

// message handlers
import BaseMessageHandler from '@extension/message-handlers/BaseMessageHandler';

// types
import type { IBaseOptions, IExternalAccount } from '@common/types';
import type { IAccount } from '@extension/types';

// utils
import isWatchAccount from '@extension/utils/isWatchAccount';

export default class WebAuthnMessageHandler extends BaseMessageHandler {
  // private variables
  private readonly _accountRepository: AccountRepository;

  constructor(options: IBaseOptions) {
    super(options);

    this._accountRepository = new AccountRepository();
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

  /**
   * protected methods
   */

  protected async _onMessage(
    message: WebAuthnAccountsRequestMessage,
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
