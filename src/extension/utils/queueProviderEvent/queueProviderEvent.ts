import browser from 'webextension-polyfill';

// enums
import { AppTypeEnum } from '@extension/enums';

// managers
import AppWindowManager from '@extension/managers/AppWindowManager';

// messages
import ProviderEventAddedMessage from '@common/messages/ProviderEventAddedMessage';

// repositories
import AppWindowRepository from '@extension/repositories/AppWindowRepository';
import EventQueueRepository from '@extension/repositories/EventQueueRepository';

// types
import type { IBaseOptions } from '@common/types';
import type { IOptions } from './types';

// utils
import isProviderInitialized from '@extension/utils/isProviderInitialized';

/**
 * Convenience function that adds an even to the event queue and, if the main app is open, posts a message. However, if
 * there is no main app window open, a background app window is launched with the event ID added to the URL.
 * @param {IOptions} options - the event and the services needed to create the event.
 */
export default async function queueProviderEvent({
  appWindowRepository,
  event,
  eventQueueRepository,
  logger,
}: IOptions & IBaseOptions): Promise<void> {
  const _appWindowRepository = appWindowRepository || new AppWindowRepository();
  const _eventQueueRepository =
    eventQueueRepository || new EventQueueRepository();
  const _functionName = 'sendProviderEvent';
  const isInitialized = await isProviderInitialized();
  const mainAppWindows = await _appWindowRepository.fetchByType(
    AppTypeEnum.MainApp
  );
  let appWindowManager: AppWindowManager;

  // not initialized, ignore it
  if (!isInitialized) {
    return;
  }

  appWindowManager = new AppWindowManager({ logger });

  // remove any closed windows
  await appWindowManager.hydrate();

  logger?.debug(
    `${_functionName}: saving event "${event.type}" to event queue`
  );

  // save event to the queue
  await _eventQueueRepository.save(event);

  // if a main app is open, post that a new event has been added to the queue
  if (mainAppWindows.length > 0) {
    logger?.debug(
      `${_functionName}: main app window open, posting that event "${event.id}" has been added to the queue`
    );

    return await browser.runtime.sendMessage(
      new ProviderEventAddedMessage(event.id)
    );
  }

  logger?.debug(
    `${_functionName}: main app window not open, opening background app window for "${event.type}" event`
  );

  await appWindowManager.createWindow({
    searchParams: new URLSearchParams({
      eventId: encodeURIComponent(event.id), // add the event id to the url search params, so the app knows which event to use
    }),
    type: AppTypeEnum.BackgroundApp,
  });
}
