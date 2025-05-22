import type { TextareaProps } from '@chakra-ui/react';

// types
import type { IBaseComponentProps } from '@common/types';

interface IProps {
  charactersRemaining?: number;
  error?: string | null;
  id?: string;
  label: string;
  required?: boolean;
  validate?: (value: string) => string | null;
}
type TProps = IProps & IBaseComponentProps & TextareaProps;

export default TProps;
