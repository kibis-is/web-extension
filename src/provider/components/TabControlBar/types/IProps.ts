// types
import type { IBaseComponentProps } from '@common/types';
import type ITabControlBarButtonProps from './ITabControlBarButtonProps';

interface IProps extends IBaseComponentProps {
  buttons: ITabControlBarButtonProps[];
  isLoading?: boolean;
  loadingTooltipLabel?: string;
  onRefresh?: () => void;
}

export default IProps;
