import { generate as generateUUID } from '@agoralabs-sh/uuid';

// config
import { networks } from '@extension/config';

// constants
import { ACCOUNTS_ITEM_KEY_PREFIX } from '@extension/constants';

// enums
import { AssetTypeEnum, DelimiterEnum } from '@extension/enums';

// repositories
import BaseRepository from '@extension/repositories/BaseRepository';

// types
import type {
  IAccount,
  IAccountInformation,
  IAccountNetworkStakingApps,
  IAccountTransactions,
  IAccountWithExtendedProps,
  IInitializeAccountOptions,
  INetwork,
} from '@extension/types';
import type { ISaveOptions } from './types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';
import sortByIndex from '@extension/utils/sortByIndex';

export default class AccountRepository extends BaseRepository {
  /**
   * public static functions
   */

  /**
   * Convenience function that extracts the account information for a given network.
   * @param {IAccount} account - the account to get the account information from.
   * @param {INetwork} network - the network to look for.
   * @returns {IAccountInformation | null} the account information for the network, or none if no network exists.
   */
  public static extractAccountInformationForNetwork(
    { networkInformation }: IAccount,
    { genesisHash }: INetwork
  ): IAccountInformation | null {
    const accountInformation: IAccountInformation | null =
      networkInformation[convertGenesisHashToHex(genesisHash)];

    if (!accountInformation) {
      return null;
    }

    return {
      ...AccountRepository.initializeDefaultAccountInformation(), // ensure any new items are initialized
      ...accountInformation,
    };
  }

  /**
   * Convenience function that extracts the account transactions for a given network.
   * @param {IAccount} account - the account to get the account transactions from.
   * @param {INetwork} network - the network to look for.
   * @returns {IAccountInformation | null} the account transactions for the network, or none if no network exists.
   */
  public static extractAccountTransactionsForNetwork(
    { networkTransactions }: IAccount,
    { genesisHash }: INetwork
  ): IAccountTransactions | null {
    return networkTransactions[convertGenesisHashToHex(genesisHash)] || null;
  }

  /**
   * Initializes the default account. This also initializes the default account info for each network.
   * @param {IInitializeAccountOptions} options - various options needed to initialize the account.
   * @returns {IAccount} an initialized default account.
   * @public
   * @static
   */
  public static initializeDefaultAccount({
    createdAt,
    id,
    name,
    publicKey,
  }: IInitializeAccountOptions): IAccount {
    const createdAtOrNow: number = createdAt || new Date().getTime();

    return {
      _delimiter: DelimiterEnum.Account,
      color: null,
      createdAt: createdAtOrNow,
      groupID: null,
      groupIndex: null,
      icon: null,
      id: id || generateUUID(),
      name: name || null,
      networkInformation: networks.reduce<Record<string, IAccountInformation>>(
        (acc, { genesisHash }) => ({
          ...acc,
          [convertGenesisHashToHex(genesisHash)]:
            AccountRepository.initializeDefaultAccountInformation(),
        }),
        {}
      ),
      networkStakingApps: networks.reduce<
        Record<string, IAccountNetworkStakingApps>
      >(
        (acc, { genesisHash }) => ({
          ...acc,
          [convertGenesisHashToHex(genesisHash)]:
            AccountRepository.initializeDefaultNetworkStakingApps(),
        }),
        {}
      ),
      networkTransactions: networks.reduce<
        Record<string, IAccountTransactions>
      >(
        (acc, { genesisHash }) => ({
          ...acc,
          [convertGenesisHashToHex(genesisHash)]:
            AccountRepository.initializeDefaultAccountTransactions(),
        }),
        {}
      ),
      index: null,
      passkeys: [],
      publicKey,
      updatedAt: createdAtOrNow,
    };
  }

  public static initializeDefaultAccountInformation(): IAccountInformation {
    return {
      arc0072AssetHoldings: [],
      arc200AssetHoldings: [],
      atomicBalance: '0',
      authAddress: null,
      enVoi: {
        items: [],
        primaryName: null,
      },
      minAtomicBalance: '0',
      standardAssetHoldings: [],
      updatedAt: null,
    };
  }

  public static initializeDefaultAccountTransactions(): IAccountTransactions {
    return {
      next: null,
      transactions: [],
    };
  }

  public static initializeDefaultNetworkStakingApps(): IAccountNetworkStakingApps {
    return {
      apps: [],
      lastUpdatedAt: 0,
    };
  }

  /**
   * Sorts a list by the `groupIndex` property, where lower indexes take precedence. If `groupIndex` is null they are put
   * to the back and sorted by the `createdAt` property, ascending order (oldest first).
   * @param {IAccountWithExtendedProps[]} items - The items to sort.
   * @returns {IAccountWithExtendedProps[]} the sorted items.
   * @public
   * @static
   */
  public static sortByGroupIndex(
    items: IAccountWithExtendedProps[]
  ): IAccountWithExtendedProps[] {
    return items.sort((a, b) => {
      // if both positions are non-null, sort by position
      if (a.groupIndex !== null && b.groupIndex !== null) {
        return a.groupIndex - b.groupIndex;
      }

      // if `a` position is null, place it after a `b` non-null position
      if (a.groupIndex === null && b.groupIndex !== null) {
        return 1; // `a` comes after `b`
      }

      // if `b` position is null, place it after a `a` non-null position
      if (a.groupIndex !== null && b.groupIndex === null) {
        return -1; // `a` comes before `b`
      }

      // if both positions are null, sort by `createdat` (ascending)
      return a.createdAt - b.createdAt;
    });
  }

  /**
   * private functions
   */

  /**
   * Convenience function that simply creates the account item key from the account ID.
   * @param {string} id - the account ID.
   * @returns {string} the account item key.
   */
  private _createItemKey(id: string): string {
    return `${ACCOUNTS_ITEM_KEY_PREFIX}${id}`;
  }

  /**
   * Sanitizes the account, only returning properties that are in the account object.
   * @param {IAccount} account - the account object to sanitize.
   * @returns {IAccount} the sanitized account object.
   * @private
   */
  private _sanitize(account: IAccount): IAccount {
    return {
      _delimiter: DelimiterEnum.Account,
      color: account.color,
      createdAt: account.createdAt,
      groupID: account.groupID,
      groupIndex:
        typeof account.groupIndex === 'number' ? account.groupIndex : null, // if 0, this is "falsy" in the js world, so let's be specific
      icon: account.icon,
      id: account.id,
      name: account.name,
      networkInformation: Object.keys(account.networkInformation).reduce<
        Record<string, IAccountInformation>
      >(
        (acc, value) => ({
          ...acc,
          [value]: this._sanitizeAccountInformation(
            account.networkInformation[value]
          ),
        }),
        {}
      ),
      networkStakingApps: account.networkStakingApps,
      networkTransactions: Object.keys(account.networkTransactions).reduce<
        Record<string, IAccountTransactions>
      >(
        (acc, value) => ({
          ...acc,
          [value]: this._sanitizeAccountTransactions(
            account.networkTransactions[value]
          ),
        }),
        {}
      ),
      index: typeof account.index === 'number' ? account.index : null, // if 0, this is "falsy" in the js world, so let's be specific
      passkeys: account.passkeys,
      publicKey: account.publicKey,
      updatedAt: account.updatedAt,
    };
  }

  /**
   * Sanitizes the account information, only returning properties that are in the account information object.
   * @param {IAccountInformation} accountInformation - the account information object to sanitize.
   * @returns {IAccountInformation} the sanitized account information object.
   * @private
   */
  private _sanitizeAccountInformation(
    accountInformation: IAccountInformation
  ): IAccountInformation {
    return {
      arc0072AssetHoldings: accountInformation.arc0072AssetHoldings,
      arc200AssetHoldings: accountInformation.arc200AssetHoldings,
      atomicBalance: accountInformation.atomicBalance,
      authAddress: accountInformation.authAddress,
      enVoi: accountInformation.enVoi,
      minAtomicBalance: accountInformation.minAtomicBalance,
      standardAssetHoldings: accountInformation.standardAssetHoldings,
      updatedAt: accountInformation.updatedAt,
    };
  }

  /**
   * Sanitizes the account transactions, only returning properties that are in the account transactions object.
   * @param {IAccountTransactions} accountTransactions - the account transactions object to sanitize.
   * @returns {IAccountTransactions} The sanitized account transactions object.
   * @private
   */
  private _sanitizeAccountTransactions(
    accountTransactions: IAccountTransactions
  ): IAccountTransactions {
    return {
      next: accountTransactions.next,
      transactions: accountTransactions.transactions,
    };
  }

  /**
   * public functions
   */

  /**
   * Fetches all accounts.
   * @returns {Promise<IAccount[]>} A Promise that resolves to the accounts in storage.
   * @public
   */
  public async fetchAll(): Promise<IAccount[]> {
    let accounts = await this._fetchByPrefixKey<IAccount>(
      ACCOUNTS_ITEM_KEY_PREFIX
    );

    accounts = accounts.map((value) => {
      const account = {
        ...AccountRepository.initializeDefaultAccount({
          publicKey: value.publicKey,
        }),
        ...value,
      };

      return {
        ...account,
        // if there are new networks in the config, create default account information and transactions for these new networks
        networkInformation: networks.reduce<
          Record<string, IAccountInformation>
        >((acc, { genesisHash }) => {
          const encodedGenesisHash = convertGenesisHashToHex(genesisHash);
          const accountInformation = {
            ...AccountRepository.initializeDefaultAccountInformation(), // initialize with any new values
            ...account.networkInformation[encodedGenesisHash],
          };

          return {
            ...acc,
            [encodedGenesisHash]: {
              ...AccountRepository.initializeDefaultAccountInformation(),
              ...(accountInformation && {
                ...accountInformation,
                arc200AssetHoldings: accountInformation.arc200AssetHoldings.map(
                  (value) => ({
                    ...value,
                    type: AssetTypeEnum.ARC0200,
                  })
                ),
                standardAssetHoldings:
                  accountInformation.standardAssetHoldings.map((value) => ({
                    ...value,
                    type: AssetTypeEnum.Standard,
                  })),
              }),
            },
          };
        }, {}),
        networkStakingApps: networks.reduce<
          Record<string, IAccountNetworkStakingApps>
        >((acc, { genesisHash }) => {
          const encodedGenesisHash = convertGenesisHashToHex(genesisHash);

          return {
            ...acc,
            [encodedGenesisHash]: {
              ...AccountRepository.initializeDefaultNetworkStakingApps(), // initialize with any new values
              ...account.networkStakingApps[encodedGenesisHash],
            },
          };
        }, {}),
        networkTransactions: networks.reduce<
          Record<string, IAccountTransactions>
        >((acc, { genesisHash }) => {
          const encodedGenesisHash = convertGenesisHashToHex(genesisHash);

          return {
            ...acc,
            [encodedGenesisHash]: {
              ...AccountRepository.initializeDefaultAccountTransactions(), // initialize with any new values
              ...account.networkTransactions[encodedGenesisHash],
            },
          };
        }, {}),
      };
    });

    return sortByIndex(accounts);
  }

  /**
   * Gets the account for a given public key.
   * @param {string} publicKey - a hexadecimal encoded public key.
   * @returns {Promise<IAccount | null>} A promise that resolves to the account or null.
   * @public
   */
  public async fetchByPublicKey(publicKey: string): Promise<IAccount | null> {
    const accounts = await this.fetchAll();

    return (
      accounts.find(
        (value) => value.publicKey.toUpperCase() === publicKey.toUpperCase()
      ) || null
    );
  }

  /**
   * Fetches the account for a given ID.
   * @param {string} id - the account ID.
   * @returns {Promise<IAccount | null>} A promise that resolves to the account or null.
   * @public
   */
  public async fetchById(id: string): Promise<IAccount | null> {
    const item = await this._fetchByKey<IAccount>(this._createItemKey(id));

    if (!item) {
      return null;
    }

    return {
      ...AccountRepository.initializeDefaultAccount({
        publicKey: item.publicKey,
      }),
      ...item,
    };
  }

  /**
   * Removes an account by its ID.
   * @param {string} id - the account ID.
   * @public
   */
  public async removeById(id: string): Promise<void> {
    await this._removeByKeys(this._createItemKey(id));
  }

  /**
   * Saves accounts to local storage. Each network's account information is stored, but each
   * network's account transactions are only stored, if the `options.saveTransactions` is set to true, but by default
   * no transaction data is saved.
   *
   * This function will overwrite any previous account data indexed by the account ID.
   * @param {IAccount[]} items - the list of accounts to save.
   * @param {ISaveOptions} options - various options to affect how the data is saved.
   * @returns {Promise<IAccount[]>} A promise that resolves to the accounts that were passed in the argument.
   * @public
   * @todo cache the first 100 transactions
   */
  public async saveMany(
    items: IAccount[],
    { saveTransactions }: ISaveOptions = { saveTransactions: false }
  ): Promise<IAccount[]> {
    const batches = this._itemize<IAccount>(items);

    // save accounts in batches
    for (const batch of batches) {
      await this._save<IAccount>(
        batch.reduce<Record<string, IAccount>>(
          (acc, account) => ({
            ...acc,
            [this._createItemKey(account.id)]: {
              ...this._sanitize(account),
              // only save transactions if explicitly allowed
              // TODO: cache the first 100
              ...(saveTransactions && {
                networkTransactions: networks.reduce(
                  (acc, { genesisHash }) => ({
                    ...acc,
                    [convertGenesisHashToHex(genesisHash)]:
                      AccountRepository.initializeDefaultAccountTransactions(),
                  }),
                  {}
                ),
              }),
            },
          }),
          {}
        )
      );
    }

    return items;
  }
}
