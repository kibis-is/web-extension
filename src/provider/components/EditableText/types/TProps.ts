import type { TextProps } from '@chakra-ui/react';

// types
import type { IBaseComponentProps } from '@common/types';

interface IProps {
  characterLimit?: number;
  color?: string;
  fontSize?: string;
  isEditing?: boolean;
  isLoading?: boolean;
  onCancel: () => void;
  onSubmit: (value: string) => void;
  placeholder?: string;
  value: string;
}
type TProps = IProps & IBaseComponentProps & Omit<TextProps, 'onSubmit'>;

export default TProps;
