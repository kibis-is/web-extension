// types
import type { IModalProps } from '@provider/types';

interface IEnVoiSelectModalProps extends IModalProps {
  context: string;
  isOpen: boolean;
  names: string[];
  onSelect: (value: number) => void;
  selectedIndex: number;
}

export default IEnVoiSelectModalProps;
