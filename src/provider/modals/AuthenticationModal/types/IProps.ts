// errors
import { BaseExtensionError } from '@common/errors';

// types
import type { IModalProps, TEncryptionCredentials } from '@provider/types';

interface IProps extends IModalProps {
  forceAuthentication?: boolean;
  isOpen: boolean;
  passwordHint?: string;
  onConfirm: (result: TEncryptionCredentials) => void;
  onError?: (error: BaseExtensionError) => void;
}

export default IProps;
