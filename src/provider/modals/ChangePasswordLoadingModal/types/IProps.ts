// types
import type { IEncryptionState } from '@provider/components/authentication/ReEncryptKeysLoadingContent';
import type { IModalProps } from '@provider/types';

interface IProps extends IModalProps {
  encryptionProgressState: IEncryptionState[];
  isOpen: boolean;
}

export default IProps;
