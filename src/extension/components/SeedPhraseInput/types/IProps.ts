// types
import type { IBaseComponentProps } from '@common/types';

interface IProps extends IBaseComponentProps {
  disabled?: boolean;
  error: string | null;
  onChange: (phrases: string[]) => void;
  phrases: string[];
}

export default IProps;
