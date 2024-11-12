import type { InputProps } from '@chakra-ui/react';

interface IProps extends Omit<InputProps, 'onSubmit'> {
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

export default IProps;
