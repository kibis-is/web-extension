// types
import type { IBaseComponentProps } from '@common/types';
import type { IModalProps } from '@extension/types';
import type IOption from './IOption';

interface ISelectModalProps {
  emptySpaceMessage?: string;
  isOpen: boolean;
  onSelect: (index: number) => void;
  options: IOption[];
  selectedIndex?: number;
  title?: string;
}
type TSelectModalProps = ISelectModalProps & IBaseComponentProps & IModalProps;

export default TSelectModalProps;
