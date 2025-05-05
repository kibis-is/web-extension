// types
import type { IAccountPasskey } from '@provider/types';

interface IItemProps {
  disabled?: boolean;
  onClick: (id: string) => void;
  passkey: IAccountPasskey;
}

export default IItemProps;
