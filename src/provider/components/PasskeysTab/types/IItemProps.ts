// types
import type { IAccountPasskey } from '@provider/types';

interface IItemProps {
  onRemoveClick: (id: string) => void;
  onViewClick: (id: string) => void;
  passkey: IAccountPasskey;
}

export default IItemProps;
