import type { IconProps } from '@chakra-ui/react';

// types
import type IBaseComponentProps from './IBaseComponentProps';

interface IProps {
  accentColor?: string;
  primaryColor?: string;
}
type TEmptyIconProps = IProps & IBaseComponentProps & Omit<IconProps, 'fill'>;

export default TEmptyIconProps;
