import { generate as generateUUID } from '@agoralabs-sh/uuid';

// constants
import { ACCOUNT_GROUPS_ITEM_KEY } from '@provider/constants';

// enums
import { DelimiterEnum } from '@provider/enums';

// repositories
import BaseRepository from '@provider/repositories/BaseRepository';

// types
import type { IAccount, IAccountGroup } from '@provider/types';

// utils
import upsertItemsById from '@provider/utils/upsertItemsById';

export default class AccountGroupRepository extends BaseRepository {
  /**
   * public static functions
   */

  public static initializeDefaultAccountGroup(name: string): IAccountGroup {
    return {
      _delimiter: DelimiterEnum.Group,
      createdAt: new Date().getTime(),
      id: generateUUID(),
      index: null,
      name,
    };
  }

  /**
   * Convenience function to count the number of accounts that belong to a group.
   * @param {string} groupID - The group ID to check.
   * @param {IAccount[]} accounts - A list of accounts to check through.
   * @returns {number} The number of accounts that belong to a group.
   * @public
   * @static
   */
  public static numberOfAccountsInGroup(groupID: string, accounts: IAccount[]): number {
    return accounts.filter((value) => !!value.groupID && value.groupID === groupID).length;
  }

  /**
   * private functions
   */

  private _sanitize(group: IAccountGroup): IAccountGroup {
    return {
      _delimiter: DelimiterEnum.Group,
      createdAt: group.createdAt,
      id: group.id,
      index: typeof group.index === 'number' ? group.index : null, // if 0, this is "falsy" in the js world, so let's be specific
      name: group.name,
    };
  }

  /**
   * public functions
   */

  /**
   * Fetches the account groups from storage.
   * @returns {Promise<IAccountGroup[]>} A promise that resolves to the account groups.
   * @public
   */
  public async fetchAll(): Promise<IAccountGroup[]> {
    const items = await this._fetchByKey<IAccountGroup[]>(ACCOUNT_GROUPS_ITEM_KEY);

    if (!items) {
      return [];
    }

    return items.map(this._sanitize);
  }

  /**
   * Removes a group by its ID.
   * @param {string} id - the group ID.
   * @public
   */
  public async removeByID(id: string): Promise<void> {
    const items = await this.fetchAll();

    await this._save<IAccountGroup[]>({
      [ACCOUNT_GROUPS_ITEM_KEY]: items.filter((value) => value.id !== id),
    });
  }

  /**
   * Saves the account group to storage.
   * @param {IAccountGroup} value - The account group to upsert.
   * @returns {Promise<IAccountGroup>} A promise that resolves to the account group.
   * @public
   */
  public async save(value: IAccountGroup): Promise<IAccountGroup> {
    let items = await this.fetchAll();

    items = upsertItemsById(items, [value]);

    await this._save<IAccountGroup[]>({
      [ACCOUNT_GROUPS_ITEM_KEY]: items.map(this._sanitize),
    });

    return value;
  }

  /**
   * Saves a list of account groups to storage.
   * @param {IAccountGroup[]} items - The account groups to upsert.
   * @returns {Promise<IAccountGroup[]>} A promise that resolves to the account groups.
   * @public
   */
  public async saveMany(items: IAccountGroup[]): Promise<IAccountGroup[]> {
    let _items = await this.fetchAll();

    _items = upsertItemsById(_items, items);

    await this._save<IAccountGroup[]>({
      [ACCOUNT_GROUPS_ITEM_KEY]: _items.map(this._sanitize),
    });

    return items;
  }
}
