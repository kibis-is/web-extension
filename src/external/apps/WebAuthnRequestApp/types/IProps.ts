// types
import type { IAppProps } from '@common/types';

interface IProps extends IAppProps {
  onResponse: () => void;
}

export default IProps;
