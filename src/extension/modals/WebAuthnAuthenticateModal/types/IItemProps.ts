// types
import type { IAccountPasskey } from '@extension/types';

interface IItemProps {
  disabled?: boolean;
  onClick: (id: string) => void;
  passkey: IAccountPasskey;
}

export default IItemProps;
