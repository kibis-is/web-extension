// types
import type { IBaseComponentProps } from '@common/types';

interface IProps extends IBaseComponentProps {
  address: string;
  isEditing: boolean;
  isLoading: boolean;
  name: string | null;
  onCancel: () => void;
  onSubmitChange: (value: string | null) => void;
}

export default IProps;
