import type { StackProps } from '@chakra-ui/react';
import type { IconType } from 'react-icons';

// types
import type { IBaseComponentProps } from '@common/types';
import type IButtonProps from './IButtonProps';

interface IProps extends StackProps {
  button?: IButtonProps;
  description?: string;
  icon?: IconType;
  text: string;
}
type TProps = IProps & IBaseComponentProps & StackProps;

export default TProps;
