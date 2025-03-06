import type { StackProps } from '@chakra-ui/react';

// types
import type { IBaseComponentProps } from '@common/types';

interface IProps {
  error?: string | null;
  inputID?: string;
  label: string;
  required?: boolean;
}
type TProps = IProps & IBaseComponentProps & StackProps;

export default TProps;
