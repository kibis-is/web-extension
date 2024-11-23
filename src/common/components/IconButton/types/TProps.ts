import type { IconButtonProps } from '@chakra-ui/react';
import type { IconType } from 'react-icons';

// types
import type { IBaseComponentProps } from '@common/types';

interface IProps {
  icon: IconType;
}
type TProps = IProps & IBaseComponentProps & Omit<IconButtonProps, 'icon'>;

export default TProps;
