import type { InputProps } from '@chakra-ui/react';

// types
import type { IBaseComponentProps } from '@common/types';

interface IProps {
  charactersRemaining?: number;
  error?: string | null;
  id?: string;
  informationText?: string;
  isLoading?: boolean;
  label: string;
  onSubmit?: () => void;
  required?: boolean;
  validate?: (value: string) => string | null;
}
type TProps = IProps & IBaseComponentProps & Omit<InputProps, 'onSubmit'>;

export default TProps;
