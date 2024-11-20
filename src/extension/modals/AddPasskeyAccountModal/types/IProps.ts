// types
import type { IModalProps, INewAccountWithPasskey } from '@extension/types';

interface IProps extends IModalProps {
  isOpen: boolean;
  onComplete: (result: INewAccountWithPasskey) => void;
}

export default IProps;
