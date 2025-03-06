// types
import type { IBaseComponentProps } from '@common/types';

interface IProps extends IBaseComponentProps {
  onPreviousClick: () => void;
  uri: string;
}

export default IProps;
