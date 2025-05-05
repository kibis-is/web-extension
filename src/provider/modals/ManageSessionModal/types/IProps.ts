// types
import type { IModalProps, ISession } from '@provider/types';

interface IProps extends IModalProps {
  session: ISession | null;
}

export default IProps;
