// types
import type { IBaseComponentProps } from '@common/types';
import type IOption from './IOption';

interface IProps extends IBaseComponentProps {
  buttonTooltipLabel?: string;
  disabled?: boolean;
  emptyOptionLabel?: string;
  label?: string;
  modalTitle?: string;
  modalEmptySpaceMessage?: string;
  onSelect: (option: IOption | null) => void;
  options: IOption[];
  required?: boolean;
  value?: IOption;
}

export default IProps;
