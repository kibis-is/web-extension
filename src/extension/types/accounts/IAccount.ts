// enums
import { DelimiterEnum } from '@extension/enums';

// types
import type { TAccountColors, TAccountIcons } from '@common/types';
import type IAccountInformation from './IAccountInformation';
import type IAccountNetworkStakingApps from './IAccountNetworkStakingApps';
import type IAccountTransactions from './IAccountTransactions';
import IAccountPasskey from './IAccountPasskey';

/**
 * @property {TAccountColors | null} color - The background color.
 * @property {number} createdAt - A timestamp (in milliseconds) when this account was created in storage.
 * @property {TAccountIcons | null} icon - An icon for the account.
 * @property {string | null} groupID - The ID of the group this account belongs to.
 * @property {number | null} groupIndex - The index of where this item belongs in the group.
 * @property {string} id - A unique identifier (in UUIDv4).
 * @property {number | null} index - The position of the account as it appears in a list.
 * @property {string | null} name - A canonical name given to this account.
 * @property {Record<string, IAccountInformation>} networkInformation - Information specific for each network, indexed by
 * their hex encoded genesis hash.
 * @property {Record<string, IAccountNetworkStakingApps>} networkStakingApps - The staking apps specific for each
 * network, indexed by their hex encoded genesis hash.
 * @property {Record<string, IAccountTransactions>} networkTransactions - Transactions specific for each network, indexed
 * by their hex encoded genesis hash.
 * @property {IAccountPasskey[]} passkeys - Registered passkeys associated with this account.
 * @property {string} publicKey - The hexadecimal encoded public key.
 * @property {number} updatedAt - A timestamp (in milliseconds) for when this account was last saved to storage.
 */
interface IAccount {
  _delimiter: DelimiterEnum.Account;
  color: TAccountColors | null;
  createdAt: number;
  groupID: string | null;
  groupIndex: number | null;
  icon: TAccountIcons | null;
  id: string;
  index: number | null;
  name: string | null;
  networkInformation: Record<string, IAccountInformation>;
  networkStakingApps: Record<string, IAccountNetworkStakingApps>;
  networkTransactions: Record<string, IAccountTransactions>;
  passkeys: IAccountPasskey[];
  publicKey: string;
  updatedAt: number;
}

export default IAccount;
