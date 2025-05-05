// types
import type { IOptions, IType } from './types';

/**
 * Sorts a list by the `index` property, where lower indexes take precedence. If `index` is null they are put
 * to the back and sorted by the `createdAt` property, ascending order (oldest first).
 * @param {Type extends IType[]} items - The items to sort.
 * @param {IOptions} options - [optional] applies indexes on items that do not have indexes.
 * @returns {Type extends IType[]} the sorted items.
 */
export default function sortByIndex<Type extends IType>(
  items: Type[],
  { mutateIndex }: IOptions = { mutateIndex: false }
): Type[] {
  const _items = items.sort((a, b) => {
    // if both positions are non-null, sort by position
    if (a.index !== null && b.index !== null) {
      return a.index - b.index;
    }

    // if `a` position is null, place it after a `b` non-null position
    if (a.index === null && b.index !== null) {
      return 1; // `a` comes after `b`
    }

    // if `b` position is null, place it after a `a` non-null position
    if (a.index !== null && b.index === null) {
      return -1; // `a` comes before `b`
    }

    // if both positions are null, sort by `createdat` (ascending)
    return a.createdAt - b.createdAt;
  });

  if (!mutateIndex) {
    return _items;
  }

  // apply the positions to the list
  return _items.map((value, index) => ({
    ...value,
    index,
  }));
}
