// types
import type { IBaseComponentProps } from '@common/types';

interface IProps extends IBaseComponentProps {
  hideBackButton?: boolean;
  loading?: boolean;
  subTitle?: string;
  title: string;
}

export default IProps;
