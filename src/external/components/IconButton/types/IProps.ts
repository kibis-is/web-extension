import type { ColorMode, IconButtonProps } from '@chakra-ui/react';
import type { IconType } from 'react-icons';

interface IProps extends Omit<IconButtonProps, 'icon'> {
  colorMode: ColorMode;
  icon: IconType;
}

export default IProps;
