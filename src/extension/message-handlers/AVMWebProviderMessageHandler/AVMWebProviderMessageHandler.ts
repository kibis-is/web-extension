import {
  ARC0027InvalidGroupIdError,
  ARC0027InvalidInputError,
  ARC0027MethodEnum,
  ARC0027NetworkNotSupportedError,
  ARC0027UnauthorizedSignerError,
  type IAccount as IAVMProviderAccount,
  type IDisableParams,
  type IDisableResult,
  type IDiscoverParams,
  type IDiscoverResult,
  type IEnableParams,
  type IEnableResult,
  type ISignMessageParams,
  type ISignMessageResult,
  type ISignTransactionsParams,
  type ISignTransactionsResult,
  type TRequestParams,
} from '@agoralabs-sh/avm-web-provider';
import {
  decode as decodeBase64,
  encode as encodeBase64,
} from '@stablelib/base64';
import { Transaction } from 'algosdk';
import { v4 as uuid } from 'uuid';
import browser, { Runtime } from 'webextension-polyfill';

// config
import { networks } from '@extension/config';

// constants
import { HOST, ICON_URI } from '@common/constants';

// enums
import { AVMWebProviderMessageReferenceEnum } from '@common/enums';
import { EventTypeEnum } from '@extension/enums';

// events
import AVMWebProviderRequestEvent from '@extension/events/AVMWebProviderRequestEvent';

// message handlers
import BaseMessageHandler from '@extension/message-handlers/BaseMessageHandler';

// messages
import AVMWebProviderRequestMessage from '@common/messages/AVMWebProviderRequestMessage';
import AVMWebProviderResponseMessage from '@common/messages/AVMWebProviderResponseMessage';
import ProviderSessionsUpdatedMessage from '@common/messages/ProviderSessionsUpdatedMessage';

// repositories
import AccountRepository from '@extension/repositories/AccountRepository';
import EventQueueRepository from '@extension/repositories/EventQueueRepository';
import SessionRepository from '@extension/repositories/SessionRepository';
import SettingsRepository from '@extension/repositories/SettingsRepository';

// types
import type { IBaseOptions } from '@common/types';
import type {
  IAccount,
  IAccountWithExtendedProps,
  INetwork,
  ISession,
} from '@extension/types';

// utils
import authorizedAccountsForHost from '@extension/utils/authorizedAccountsForHost';
import convertPublicKeyToAVMAddress from '@common/utils/convertPublicKeyToAVMAddress';
import decodeUnsignedTransaction from '@extension/utils/decodeUnsignedTransaction';
import isNetworkSupportedFromSettings from '@extension/utils/isNetworkSupportedFromSettings';
import isWatchAccount from '@extension/utils/isWatchAccount';
import queueProviderEvent from '@extension/utils/queueProviderEvent';
import selectDefaultNetwork from '@extension/utils/selectDefaultNetwork';
import supportedNetworksFromSettings from '@extension/utils/supportedNetworksFromSettings';
import verifyTransactionGroups from '@extension/utils/verifyTransactionGroups';
import uniqueGenesisHashesFromTransactions from '@extension/utils/uniqueGenesisHashesFromTransactions';

export default class AVMWebProviderMessageHandler extends BaseMessageHandler {
  // private variables
  private readonly _accountRepository: AccountRepository;
  private readonly _eventQueueRepository: EventQueueRepository;
  private readonly _sessionRepository: SessionRepository;
  private readonly _settingsRepository: SettingsRepository;

  constructor(options: IBaseOptions) {
    super(options);

    this._accountRepository = new AccountRepository();
    this._eventQueueRepository = new EventQueueRepository();
    this._sessionRepository = new SessionRepository();
    this._settingsRepository = new SettingsRepository();
  }

  /**
   * private functions
   */

  /**
   * Convenience function that fetches all accounts with the extended props.
   * @returns {Promise<IAccountWithExtendedProps[]>} a promise that resolves to all the accounts with extended props.
   * @private
   */
  private async _fetchAccounts(): Promise<IAccountWithExtendedProps[]> {
    const accounts = await this._accountRepository.fetchAll();

    return await Promise.all(
      accounts.map(async (value) => ({
        ...value,
        watchAccount: await isWatchAccount(value),
      }))
    );
  }

  /**
   * Convenience function that fetches all the sessions from storage and filters them based on a predicate, if it is
   * supplied.
   * @param {(value: ISession, index: number, array: ISession[]) => boolean} filterPredicate - [optional] a filter
   * predicate that will return only sessions that fulfill the predicate.
   * @returns {ISession[]} the filtered sessions, if a predicate was supplied, otherwise all sessions are returned.
   * @private
   */
  private async _fetchSessions(
    filterPredicate?: (
      value: ISession,
      index: number,
      array: ISession[]
    ) => boolean
  ): Promise<ISession[]> {
    const sessions: ISession[] = await this._sessionRepository.fetchAll();

    // if there is no filter predicate, return all sessions
    if (!filterPredicate) {
      return sessions;
    }

    return sessions.filter(filterPredicate);
  }

  private async _handleDisableRequestMessage(
    message: AVMWebProviderRequestMessage<IDisableParams>,
    originTabID: number
  ): Promise<void> {
    const _functionName = 'handleDisableRequestMessage';
    let network: INetwork | null;
    let sessionIds: string[];
    let sessions: ISession[];

    this._logger?.debug(
      `${AVMWebProviderMessageHandler.name}#${_functionName}: "${message.payload.method}" message received`
    );

    if (!message.payload.params) {
      return await this._sendResponseToMiddleware(
        new AVMWebProviderResponseMessage<IDisableResult>({
          error: new ARC0027InvalidInputError({
            message: `no parameters supplied`,
            providerId: __PROVIDER_ID__,
          }),
          id: uuid(),
          reference: AVMWebProviderMessageReferenceEnum.Response,
          method: message.payload.method,
          requestID: message.id,
          result: null,
        }),
        originTabID
      );
    }

    network = selectDefaultNetwork(networks);

    if (message.payload.params.genesisHash) {
      network =
        networks.find(
          (value) => value.genesisHash === message.payload.params?.genesisHash
        ) || network;
    }

    // get the network if a genesis hash is present
    if (!network) {
      this._logger?.debug(
        `${AVMWebProviderMessageHandler.name}#${_functionName}: network not found`
      );

      // send the response to the web page (via the content script)
      return await this._sendResponseToMiddleware(
        new AVMWebProviderResponseMessage<IDisableResult>({
          error: new ARC0027NetworkNotSupportedError({
            genesisHashes: message.payload.params?.genesisHash
              ? [message.payload.params.genesisHash]
              : [],
            message: `no parameters supplied`,
            providerId: __PROVIDER_ID__,
          }),
          id: uuid(),
          method: message.payload.method,
          reference: AVMWebProviderMessageReferenceEnum.Response,
          requestID: message.id,
          result: null,
        }),
        originTabID
      );
    }

    sessions = await this._fetchSessions(
      (value) =>
        value.host === message.payload.clientInfo.host &&
        value.genesisHash === network?.genesisHash
    );

    // if session ids has been specified, filter the sessions
    if (
      message.payload.params.sessionIds &&
      message.payload.params.sessionIds.length > 0
    ) {
      sessions = sessions.filter((value) =>
        message.payload.params?.sessionIds?.includes(value.id)
      );
    }

    sessionIds = sessions.map((value) => value.id);

    this._logger?.debug(
      `${
        AVMWebProviderMessageHandler.name
      }#${_functionName}: removing sessions [${sessionIds
        .map((value) => `"${value}"`)
        .join(',')}] on host "${
        message.payload.clientInfo.host
      }" for network "${network.genesisId}"`
    );

    // remove the sessions
    await this._sessionRepository.removeByIds(sessionIds);

    // send the response to the web page (via the content script)
    await this._sendResponseToMiddleware(
      new AVMWebProviderResponseMessage<IDisableResult>({
        error: null,
        id: uuid(),
        method: message.payload.method,
        reference: AVMWebProviderMessageReferenceEnum.Response,
        requestID: message.id,
        result: {
          genesisHash: network.genesisHash,
          genesisId: network.genesisId,
          providerId: __PROVIDER_ID__,
          sessionIds,
        },
      }),
      originTabID
    );

    // send a message to the popups to indicate the sessions have been updated
    return await browser.runtime.sendMessage(
      new ProviderSessionsUpdatedMessage(sessions)
    );
  }

  private async _handleDiscoverRequestMessage(
    message: AVMWebProviderRequestMessage<IDiscoverParams>,
    originTabID: number
  ): Promise<void> {
    const _functionName = 'handleDiscoverRequestMessage';
    let supportedNetworks: INetwork[];

    this._logger?.debug(
      `${AVMWebProviderMessageHandler.name}#${_functionName}: "${message.payload.method}" message received`
    );

    supportedNetworks = supportedNetworksFromSettings({
      networks,
      settings: await this._settingsRepository.fetch(),
    });

    return await this._sendResponseToMiddleware(
      new AVMWebProviderResponseMessage<IDiscoverResult>({
        error: null,
        id: uuid(),
        method: message.payload.method,
        reference: AVMWebProviderMessageReferenceEnum.Response,
        requestID: message.id,
        result: {
          host: HOST,
          icon: ICON_URI,
          name: __APP_TITLE__,
          networks: supportedNetworks.map(
            ({ genesisHash, genesisId, methods }) => ({
              genesisHash,
              genesisId,
              methods,
            })
          ),
          providerId: __PROVIDER_ID__,
        },
      }),
      originTabID
    );
  }

  private async _handleEnableRequestMessage(
    message: AVMWebProviderRequestMessage<IEnableParams>,
    originTabID: number
  ): Promise<void> {
    const _functionName = 'handleEnableRequestMessage';
    let accounts: IAccount[];
    let session: ISession | null;
    let sessionFilterPredicate: ((value: ISession) => boolean) | undefined;
    let sessionNetwork: INetwork | null;
    let sessions: ISession[];

    this._logger?.debug(
      `${AVMWebProviderMessageHandler.name}#${_functionName}: "${message.payload.method}" message received`
    );

    // get the network if a genesis hash is present
    if (message.payload.params?.genesisHash) {
      if (
        !isNetworkSupportedFromSettings({
          genesisHash: message.payload.params.genesisHash,
          networks,
          settings: await this._settingsRepository.fetch(),
        })
      ) {
        this._logger?.debug(
          `${AVMWebProviderMessageHandler.name}#${_functionName}: genesis hash "${message.payload.params.genesisHash}" is not supported`
        );

        // send the response to the web page (via the content script)
        return await this._sendResponseToMiddleware(
          new AVMWebProviderResponseMessage<IEnableResult>({
            error: new ARC0027NetworkNotSupportedError({
              genesisHashes: [message.payload.params.genesisHash],
              message: `no parameters supplied`,
              providerId: __PROVIDER_ID__,
            }),
            id: uuid(),
            method: message.payload.method,
            reference: AVMWebProviderMessageReferenceEnum.Response,
            requestID: message.id,
            result: null,
          }),
          originTabID
        );
      }

      // filter the sessions by the specified genesis hash
      sessionFilterPredicate = (value) =>
        value.genesisHash === message.payload.params?.genesisHash;
    }

    sessions = await this._fetchSessions(sessionFilterPredicate);
    session =
      sessions.find(
        (value) => value.host === message.payload.clientInfo.host
      ) || null;

    // if we have a session, update its use and return it
    if (session) {
      sessionNetwork =
        networks.find((value) => value.genesisHash === session?.genesisHash) ||
        null;

      // if the session network is supported, return update and return the session
      if (sessionNetwork) {
        accounts = await this._accountRepository.fetchAll();
        session = {
          ...session,
          usedAt: new Date().getTime(),
        };

        this._logger?.debug(
          `${AVMWebProviderMessageHandler.name}#${_functionName}: found session "${session.id}" updating`
        );

        session = await this._sessionRepository.save(session);

        // send the response to the web page (via the content script)
        return await this._sendResponseToMiddleware(
          new AVMWebProviderResponseMessage<IEnableResult>({
            error: null,
            id: uuid(),
            method: message.payload.method,
            reference: AVMWebProviderMessageReferenceEnum.Response,
            requestID: message.id,
            result: {
              accounts: session.authorizedAddresses.map<IAVMProviderAccount>(
                (address) => {
                  const account: IAccount | null =
                    accounts.find(
                      (value) =>
                        convertPublicKeyToAVMAddress(
                          AccountRepository.decode(value.publicKey)
                        ) === address
                    ) || null;

                  return {
                    address,
                    ...(account?.name && {
                      name: account.name,
                    }),
                  };
                }
              ),
              genesisHash: session.genesisHash,
              genesisId: session.genesisId,
              providerId: __PROVIDER_ID__,
              sessionId: session.id,
            },
          }),
          originTabID
        );
      }

      // if the network is unrecognized, remove the session, it is no longer valid
      await this._sessionRepository.removeByIds([session.id]);
    }

    return await this._queueProviderEvent(
      new AVMWebProviderRequestEvent({
        id: uuid(),
        payload: {
          message,
          originTabID,
        },
        type: EventTypeEnum.AVMWebProviderRequest,
      })
    );
  }

  private async _handleSignMessageRequestMessage(
    message: AVMWebProviderRequestMessage<ISignMessageParams>,
    originTabID: number
  ): Promise<void> {
    const _functionName = 'handleSignMessageRequestMessage';
    const filteredSessions = await this._fetchSessions(
      (value) => value.host === message.payload.clientInfo.host
    );
    let _error: string;
    let authorizedAccounts: IAccountWithExtendedProps[];
    let signerAccount: IAccountWithExtendedProps | null;

    this._logger?.debug(
      `${AVMWebProviderMessageHandler.name}#${_functionName}: "${message.payload.method}" message received`
    );

    if (!message.payload.params) {
      return await this._sendResponseToMiddleware(
        new AVMWebProviderResponseMessage<ISignMessageResult>({
          error: new ARC0027InvalidInputError({
            message: `no message or signer supplied`,
            providerId: __PROVIDER_ID__,
          }),
          id: uuid(),
          method: message.payload.method,
          reference: AVMWebProviderMessageReferenceEnum.Response,
          requestID: message.id,
          result: null,
        }),
        originTabID
      );
    }

    // if the app has not been enabled
    if (filteredSessions.length <= 0) {
      this._logger?.debug(
        `${AVMWebProviderMessageHandler.name}#${_functionName}: no sessions found for the "${message.payload.method}" request`
      );

      // send the response to the web page (via the content script)
      return await this._sendResponseToMiddleware(
        new AVMWebProviderResponseMessage<ISignMessageResult>({
          error: new ARC0027UnauthorizedSignerError({
            message: `"${message.payload.clientInfo.appName}" has not been authorized`,
            providerId: __PROVIDER_ID__,
            signer: message.payload.params.signer,
          }),
          id: uuid(),
          method: message.payload.method,
          reference: AVMWebProviderMessageReferenceEnum.Response,
          requestID: message.id,
          result: null,
        }),
        originTabID
      );
    }

    authorizedAccounts = authorizedAccountsForHost({
      accounts: await this._fetchAccounts(),
      host: message.payload.clientInfo.host,
      sessions: filteredSessions,
    });

    // if the requested signer has not been authorized or is a watch account
    if (message.payload.params.signer) {
      signerAccount =
        authorizedAccounts.find(
          (value) =>
            convertPublicKeyToAVMAddress(
              AccountRepository.decode(value.publicKey)
            ) === message.payload.params?.signer
        ) || null;

      if (!signerAccount || signerAccount.watchAccount) {
        _error = `"${message.payload.params.signer}" ${
          signerAccount?.watchAccount
            ? ` is a watch account`
            : `has not been authorized`
        }`;

        this._logger?.debug(
          `${AVMWebProviderMessageHandler.name}#${_functionName}: ${_error}`
        );

        // send the response to the web page (via the content script)
        return await this._sendResponseToMiddleware(
          new AVMWebProviderResponseMessage<ISignMessageResult>({
            error: new ARC0027UnauthorizedSignerError({
              message: _error,
              providerId: __PROVIDER_ID__,
              signer: message.payload.params.signer,
            }),
            id: uuid(),
            method: message.payload.method,
            reference: AVMWebProviderMessageReferenceEnum.Response,
            requestID: message.id,
            result: null,
          }),
          originTabID
        );
      }
    }

    return await this._queueProviderEvent(
      new AVMWebProviderRequestEvent({
        id: uuid(),
        payload: {
          message,
          originTabID,
        },
        type: EventTypeEnum.AVMWebProviderRequest,
      })
    );
  }

  private async _handleSignTransactionsRequestMessage(
    message: AVMWebProviderRequestMessage<ISignTransactionsParams>,
    originTabID: number
  ): Promise<void> {
    const _functionName: string = 'handleSignTransactionsRequestMessage';
    let decodedUnsignedTransactions: Transaction[];
    let errorMessage: string;
    let filteredSessions: ISession[];
    let genesisHashes: string[];
    let supportedNetworks: INetwork[];
    let unsupportedTransactionsByNetwork: Transaction[];

    this._logger?.debug(
      `${AVMWebProviderMessageHandler.name}#${_functionName}: "${message.payload.method}" message received`
    );

    if (!message.payload.params) {
      return await this._sendResponseToMiddleware(
        new AVMWebProviderResponseMessage<ISignTransactionsResult>({
          error: new ARC0027InvalidInputError({
            message: `no transactions supplied`,
            providerId: __PROVIDER_ID__,
          }),
          id: uuid(),
          method: message.payload.method,
          reference: AVMWebProviderMessageReferenceEnum.Response,
          requestID: message.id,
          result: null,
        }),
        originTabID
      );
    }

    // attempt to decode the transactions
    try {
      decodedUnsignedTransactions = message.payload.params.txns.map((value) =>
        decodeUnsignedTransaction(decodeBase64(value.txn))
      );
    } catch (error) {
      errorMessage = `failed to decode transactions: ${error.message}`;

      this._logger?.debug(
        `${AVMWebProviderMessageHandler.name}#${_functionName}: ${errorMessage}`
      );

      // send the response to the web page (via the content script)
      return await this._sendResponseToMiddleware(
        new AVMWebProviderResponseMessage<ISignTransactionsResult>({
          error: new ARC0027InvalidInputError({
            message: errorMessage,
            providerId: __PROVIDER_ID__,
          }),
          id: uuid(),
          method: message.payload.method,
          reference: AVMWebProviderMessageReferenceEnum.Response,
          requestID: message.id,
          result: null,
        }),
        originTabID
      );
    }

    // verify the transaction groups
    if (!verifyTransactionGroups(decodedUnsignedTransactions)) {
      errorMessage = `the supplied transactions are invalid and do not conform to the arc-0001 group validation, please https://arc.algorand.foundation/ARCs/arc-0001#group-validation on how to correctly build transactions`;

      this._logger?.debug(
        `${AVMWebProviderMessageHandler.name}#${_functionName}: ${errorMessage}`
      );

      // send the response to the web page (via the content script)
      return await this._sendResponseToMiddleware(
        new AVMWebProviderResponseMessage<ISignTransactionsResult>({
          error: new ARC0027InvalidGroupIdError({
            message: errorMessage,
            providerId: __PROVIDER_ID__,
          }),
          id: uuid(),
          method: message.payload.method,
          reference: AVMWebProviderMessageReferenceEnum.Response,
          requestID: message.id,
          result: null,
        }),
        originTabID
      );
    }

    supportedNetworks = supportedNetworksFromSettings({
      networks,
      settings: await this._settingsRepository.fetch(),
    });
    unsupportedTransactionsByNetwork = decodedUnsignedTransactions.filter(
      (transaction) =>
        supportedNetworks.every(
          (value) => value.genesisHash !== encodeBase64(transaction.genesisHash)
        )
    ); // get any transaction that whose genesis hash is not supported

    // check if any transactions contain unsupported networks
    if (unsupportedTransactionsByNetwork.length > 0) {
      this._logger?.debug(
        `${
          AVMWebProviderMessageHandler.name
        }#${_functionName}: transactions [${unsupportedTransactionsByNetwork
          .map((value) => `"${value.txID()}"`)
          .join(',')}] contain genesis hashes that are not supported`
      );

      // send the response to the web page (via the content script)
      return await this._sendResponseToMiddleware(
        new AVMWebProviderResponseMessage<ISignTransactionsResult>({
          error: new ARC0027NetworkNotSupportedError({
            genesisHashes: uniqueGenesisHashesFromTransactions(
              unsupportedTransactionsByNetwork
            ),
            providerId: __PROVIDER_ID__,
          }),
          id: uuid(),
          method: message.payload.method,
          reference: AVMWebProviderMessageReferenceEnum.Response,
          requestID: message.id,
          result: null,
        }),
        originTabID
      );
    }

    genesisHashes = uniqueGenesisHashesFromTransactions(
      decodedUnsignedTransactions
    );
    filteredSessions = await this._fetchSessions(
      (session) =>
        session.host === message.payload.clientInfo.host &&
        genesisHashes.some((value) => value === session.genesisHash)
    );

    // if the app has not been enabled
    if (filteredSessions.length <= 0) {
      this._logger?.debug(
        `${AVMWebProviderMessageHandler.name}#${_functionName}: no sessions found for sign txns request`
      );

      // send the response to the web page
      return await this._sendResponseToMiddleware(
        new AVMWebProviderResponseMessage<ISignTransactionsResult>({
          error: new ARC0027UnauthorizedSignerError({
            message: `client "${message.payload.clientInfo.appName}" has not been authorized`,
            providerId: __PROVIDER_ID__,
          }),
          id: uuid(),
          method: message.payload.method,
          reference: AVMWebProviderMessageReferenceEnum.Response,
          requestID: message.id,
          result: null,
        }),
        originTabID
      );
    }

    return await this._queueProviderEvent(
      new AVMWebProviderRequestEvent({
        id: uuid(),
        payload: {
          message,
          originTabID,
        },
        type: EventTypeEnum.AVMWebProviderRequest,
      })
    );
  }

  private async _queueProviderEvent<Params extends TRequestParams>(
    event: AVMWebProviderRequestEvent<Params>
  ): Promise<void> {
    const _functionName = '_queueProviderEvent';
    const events = await this._eventQueueRepository.fetchByType<
      AVMWebProviderRequestEvent<TRequestParams>
    >(EventTypeEnum.AVMWebProviderRequest);

    // if the client request already exists, ignore it
    if (
      events.find(
        (value) => value.payload.message.id === event.payload.message.id
      )
    ) {
      this._logger?.debug(
        `${AVMWebProviderMessageHandler.name}#${_functionName}: client request "${event.payload.message.id}" already exists, ignoring`
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
   * protected functions
   */

  protected async _onMiddlewareMessage(
    message: AVMWebProviderRequestMessage<TRequestParams>,
    sender: Runtime.MessageSender
  ): Promise<void> {
    const _functionName: string = '_onMiddlewareMessage';

    if (!sender.tab?.id) {
      this._logger?.debug(
        `${AVMWebProviderMessageHandler.name}#${_functionName}: unknown sender for "${message.payload.method}" message, ignoring`
      );

      return;
    }

    switch (message.payload.method) {
      case ARC0027MethodEnum.Disable:
        return await this._handleDisableRequestMessage(
          message as AVMWebProviderRequestMessage<IDisableParams>,
          sender.tab.id
        );
      case ARC0027MethodEnum.Discover:
        return await this._handleDiscoverRequestMessage(
          message as AVMWebProviderRequestMessage<IDiscoverParams>,
          sender.tab.id
        );
      case ARC0027MethodEnum.Enable:
        return await this._handleEnableRequestMessage(
          message as AVMWebProviderRequestMessage<IEnableParams>,
          sender.tab.id
        );
      case ARC0027MethodEnum.SignMessage:
        return await this._handleSignMessageRequestMessage(
          message as AVMWebProviderRequestMessage<ISignMessageParams>,
          sender.tab.id
        );
      case ARC0027MethodEnum.SignTransactions:
        return await this._handleSignTransactionsRequestMessage(
          message as AVMWebProviderRequestMessage<ISignTransactionsParams>,
          sender.tab.id
        );
      default:
        break;
    }
  }

  /**
   * public functions
   */

  public startListening(): void {
    browser.runtime.onMessage.addListener(this._onMiddlewareMessage.bind(this));
  }
  public stopListening() {
    browser.runtime.onMessage.removeListener(
      this._onMiddlewareMessage.bind(this)
    );
  }
}
