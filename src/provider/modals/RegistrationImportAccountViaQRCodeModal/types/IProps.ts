// types
import type { INewAccount } from '@provider/types';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (accounts: INewAccount[]) => Promise<void>;
  saving: boolean;
}

export default IProps;
