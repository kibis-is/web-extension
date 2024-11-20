// types
import type { INewAccountWithKeyPair } from '@extension/types';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (accounts: INewAccountWithKeyPair[]) => Promise<void>;
  saving: boolean;
}

export default IProps;
