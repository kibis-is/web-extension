// errors
import { BaseExtensionError } from '@common/errors';

// types
import type { IEncryptionState } from '@provider/components/ReEncryptKeysLoadingContent';
import type IRemovePasskeyActionOptions from './IRemovePasskeyActionOptions';

interface IState {
  removePasskeyAction: (options: IRemovePasskeyActionOptions) => Promise<boolean>;
  encryptionProgressState: IEncryptionState[];
  encrypting: boolean;
  error: BaseExtensionError | null;
  requesting: boolean;
  resetAction: () => void;
}

export default IState;
