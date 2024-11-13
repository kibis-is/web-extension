// types
import type { IAccountGroup } from '@extension/types';

/**
 * @property {IAccountGroup} group - The group.
 * @property {boolean} isShortForm - Whether the full item is being shown or just the avatar.
 */
interface IGroupItemProps {
  group: IAccountGroup;
  isShortForm: boolean;
}

export default IGroupItemProps;
