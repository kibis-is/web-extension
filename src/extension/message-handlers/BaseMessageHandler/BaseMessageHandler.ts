import browser, { Runtime } from 'webextension-polyfill';

// errors
import { BaseExtensionError } from '@common/errors';

// services
import BaseListener from '@common/services/BaseListener';

// types
import type { IBaseMessage, IBaseResponseMessage } from '@common/types';

export default abstract class BaseMessageHandler extends BaseListener {
  /**
   * protected methods
   */

  protected abstract _onMiddlewareMessage(
    message: IBaseMessage<unknown>,
    sender: Runtime.MessageSender
  ): Promise<void>;

  protected async _sendResponseToMiddleware<
    Reference,
    Result,
    Error = BaseExtensionError
  >(
    message: IBaseResponseMessage<Reference, Result, Error>,
    originTabID: number
  ): Promise<void> {
    const _functionName: string = '_sendResponse';

    this._logger?.debug(
      `${BaseMessageHandler.name}#${_functionName}: sending "${message.reference}" response to middleware "${originTabID}"`
    );

    // send the response to the middleware (content script)
    return await browser.tabs.sendMessage(originTabID, message);
  }
}
