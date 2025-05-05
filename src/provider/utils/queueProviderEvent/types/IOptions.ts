// repositories
import AppWindowRepository from '@provider/repositories/AppWindowRepository';
import EventQueueRepository from '@provider/repositories/EventQueueRepository';

// types
import type { TEvents } from '@provider/types';

interface IOptions {
  appWindowRepository?: AppWindowRepository;
  event: TEvents;
  eventQueueRepository?: EventQueueRepository;
}

export default IOptions;
