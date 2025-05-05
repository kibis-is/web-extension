// types
import type { IModalProps } from '@provider/types';

interface IProps extends IModalProps {
  hint?: string;
  isOpen: boolean;
  onConfirm: (password: string) => void;
}

export default IProps;
