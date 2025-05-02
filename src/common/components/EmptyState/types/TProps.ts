import type { StackProps } from '@chakra-ui/react';
import type { ReactElement } from 'react';

// types
import type { IBaseComponentProps, TEmptyIconProps } from '@common/types';
import type IButtonProps from './IButtonProps';

interface IProps extends StackProps {
  button?: IButtonProps;
  description?: string;
  icon?: ReactElement<TEmptyIconProps>;
  text: string;
}
type TProps = IProps & IBaseComponentProps & StackProps;

export default TProps;
