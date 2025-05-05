import { generate as generateUUID } from '@agoralabs-sh/uuid';

// types
import type { ISession } from '@provider/types';
import type { IOptions } from './types';

export default function mapSessionFromEnableRequest({ authorizedAddresses, clientInfo, network }: IOptions): ISession {
  const id: string = generateUUID();
  const now: Date = new Date();

  return {
    appName: clientInfo.appName,
    authorizedAddresses,
    createdAt: now.getTime(),
    description: clientInfo.description,
    genesisHash: network.genesisHash,
    genesisId: network.genesisId,
    host: clientInfo.host,
    iconUrl: clientInfo.iconURL,
    id,
    usedAt: now.getTime(),
  };
}
