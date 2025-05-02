import { type IconProps } from '@chakra-ui/react';

// types
import type { IBaseComponentProps } from '@common/types';

interface IProps {
  accentColor?: string;
  primaryColor?: string;
}
type TProps = IProps & IBaseComponentProps & Omit<IconProps, 'fill'>;

export default TProps;
