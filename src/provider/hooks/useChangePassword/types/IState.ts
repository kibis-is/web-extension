// errors
import { BaseExtensionError } from '@common/errors';

// types
import type { IEncryptionState } from '@provider/components/ReEncryptKeysLoadingContent';
import type { IPasswordTag } from '@provider/types';
import type IChangePasswordActionOptions from './IChangePasswordActionOptions';

interface IState {
  changePasswordAction: (options: IChangePasswordActionOptions) => Promise<boolean>;
  encryptionProgressState: IEncryptionState[];
  encrypting: boolean;
  error: BaseExtensionError | null;
  passwordTag: IPasswordTag | null;
  resetAction: () => void;
  validating: boolean;
}

export default IState;
