import { ISignTransactionsParams } from '@agoralabs-sh/avm-web-provider';

// events
import AVMWebProviderRequestEvent from '@provider/events/AVMWebProviderRequestEvent';

// types
import type { IBaseOptions } from '@common/types';
import type { IAccountWithExtendedProps, INetwork, ISession } from '@provider/types';

/**
 * @property {IAccountWithExtendedProps[]} accounts - the accounts.
 * @property {AVMWebProviderRequestEvent<ISignTransactionsParams>} event - a sign transaction event.
 * @property {INetwork[]} networks - the available network.
 * @property {ISession[]} networks - the saved sessions.
 */
interface IOptions extends IBaseOptions {
  accounts: IAccountWithExtendedProps[];
  event: AVMWebProviderRequestEvent<ISignTransactionsParams>;
  networks: INetwork[];
  sessions: ISession[];
}

export default IOptions;
