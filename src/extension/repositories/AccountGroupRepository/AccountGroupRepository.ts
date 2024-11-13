import { v4 as uuid } from 'uuid';

// constants
import { ACCOUNT_GROUPS_ITEM_KEY } from '@extension/constants';

// enums
import { DelimiterEnum } from '@extension/enums';

// repositories
import BaseRepository from '@extension/repositories/BaseRepository';

// types
import type { IAccountGroup } from '@extension/types';

// utils
import upsertItemsById from '@extension/utils/upsertItemsById';

export default class AccountGroupRepository extends BaseRepository {
  /**
   * public static functions
   */

  public static initializeDefaultAccountGroup(name: string): IAccountGroup {
    return {
      _delimiter: DelimiterEnum.Group,
      createdAt: new Date().getTime(),
      id: uuid(),
      index: null,
      name,
    };
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
    const items = await this._fetchByKey<IAccountGroup[]>(
      ACCOUNT_GROUPS_ITEM_KEY
    );

    if (!items) {
      return [];
    }

    return items.map(this._sanitize);
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
