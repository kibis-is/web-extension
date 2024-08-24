import type { TextareaProps } from '@chakra-ui/react';

interface IProps extends Omit<TextareaProps, 'onError'> {
  characterLimit?: number;
  error?: string | null;
  id?: string;
  label: string;
  onError?: (value: string | null) => void;
  required?: boolean;
  validate?: (value: string) => string | null;
}

export default IProps;