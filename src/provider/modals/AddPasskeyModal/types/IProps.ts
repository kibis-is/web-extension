// types
import type { IModalProps, IPasskeyCredential } from '@provider/types';

interface IProps extends IModalProps {
  addPasskey: IPasskeyCredential | null;
}

export default IProps;
