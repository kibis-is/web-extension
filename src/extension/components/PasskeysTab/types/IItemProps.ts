// types
import type { IAccountPasskey } from '@extension/types';

interface IItemProps {
  onRemoveClick: () => void;
  onViewClick: () => void;
  passkey: IAccountPasskey;
}

export default IItemProps;
