// types
import type { IModalProps, IPasskeyCredential } from '@provider/types';

interface IProps extends IModalProps {
  removePasskey: IPasskeyCredential | null;
}

export default IProps;
