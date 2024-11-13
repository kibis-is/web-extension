// enums
import { DelimiterEnum } from '@extension/enums';

/**
 * @property {number} createdAt - a timestamp (in milliseconds) when this account was created in storage.
 * @property {string} id - a unique identifier (in UUIDv4 format).
 * @property {number | null} index - The position of the group as it appears in a list.
 * @property {string} name - The name of the group. Limited to 32 bytes.
 */
interface IAccountGroup {
  _delimiter: DelimiterEnum.Group;
  createdAt: number;
  id: string;
  index: number | null;
  name: string;
}

export default IAccountGroup;
