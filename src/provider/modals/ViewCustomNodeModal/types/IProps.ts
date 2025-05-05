// types
import type { ICustomNode, IModalProps } from '@provider/types';

interface IProps extends IModalProps {
  item: ICustomNode | null;
}

export default IProps;
