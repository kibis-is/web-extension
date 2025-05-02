// constants
import { DEFAULT_REQUEST_TIMEOUT } from '@client/constants';

// errors
import { UnknownError } from '@common/errors';

// types
import type { IBaseMessage, IBaseResponseMessage } from '@common/types';
import type { IOptions } from './types';

export default async function dispatchMessageWithTimeout<
  Result,
  Message extends IBaseMessage
>({
  delay = DEFAULT_REQUEST_TIMEOUT,
  logger,
  message,
  responseReference,
}: IOptions<Message>): Promise<Result | null> {
  return new Promise((resolve, reject) => {
    const _function = 'dispatchMessageWithTimeout';
    const listener = (event: CustomEvent<string>) => {
      let detail: IBaseResponseMessage<Result>;

      try {
        detail = JSON.parse(event.detail); // the event.detail should be a stringified message object
      } catch (error) {
        logger?.debug(`${_function}:`, error);

        // clear the timeout and remove the listener - we failed to parse the message
        window.clearTimeout(timerId);
        window.removeEventListener(responseReference, listener);

        return reject(new UnknownError(error.message));
      }

      // if the request ids or the references do not match ignore - the message may be still coming
      if (
        detail.requestID !== message.id ||
        detail.reference !== responseReference
      ) {
        return;
      }

      // clear the timeout and remove the listener - we can handle it from here
      window.clearTimeout(timerId);
      window.removeEventListener(responseReference, listener);

      // if there was an error return it
      if (detail.error) {
        return reject(detail.error);
      }

      logger?.debug(
        `${_function}: received response "${detail.reference}" for request "${detail.requestID}"`
      );

      // return the result
      return resolve(detail.result);
    };
    const timerId = window.setTimeout(() => {
      // remove the listener
      window.removeEventListener(responseReference, listener);

      reject(new UnknownError(`no response from provider`));
    }, delay);

    // listen for the response
    window.addEventListener(responseReference, listener);

    // dispatch the request message
    window.dispatchEvent(
      new CustomEvent(message.reference, {
        detail: message,
      })
    );

    logger?.debug(
      `${_function}: posted request message "${message.reference}" with id "${message.id}"`
    );
  });
}
