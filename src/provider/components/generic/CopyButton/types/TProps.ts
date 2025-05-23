import { ButtonProps } from '@chakra-ui/react';

// types
import type { IBaseComponentProps } from '@common/types';

interface IProps {
  copiedTooltipLabel?: string;
  value: string;
}
type TProps = IProps & IBaseComponentProps & ButtonProps;

export default TProps;
