// types
import type { IBaseComponentProps } from '@common/types';
import type { IOption } from '@provider/components/Select';

interface IProps extends IBaseComponentProps {
  buttonTooltipLabel?: string;
  description?: string;
  disabled?: boolean;
  emptyOptionLabel: string;
  label: string;
  modalTitle?: string;
  modalEmptySpaceMessage?: string;
  onChange: (option: IOption) => void;
  options: IOption[];
  value: IOption | undefined;
  width?: string | number;
}

export default IProps;
