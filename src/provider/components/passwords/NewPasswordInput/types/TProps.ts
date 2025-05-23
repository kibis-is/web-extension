import type { InputProps } from '@chakra-ui/react';

// types
import type { IBaseComponentProps } from '@common/types';

interface IProps {
  error?: string | null;
  id?: string;
  label?: string;
  required?: boolean;
  score: number;
}
type TProps = IProps & IBaseComponentProps & InputProps;

export default TProps;
