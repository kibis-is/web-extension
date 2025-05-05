// errors
import { BaseExtensionError } from '@common/errors';

// types
import type { IEncryptionState } from '@provider/components/ReEncryptKeysLoadingContent';
import type { IPasskeyCredential } from '@provider/types';
import type IAddPasskeyActionOptions from './IAddPasskeyActionOptions';

interface IState {
  addPasskeyAction: (options: IAddPasskeyActionOptions) => Promise<boolean>;
  encryptionProgressState: IEncryptionState[];
  encrypting: boolean;
  error: BaseExtensionError | null;
  passkey: IPasskeyCredential | null;
  requesting: boolean;
  resetAction: () => void;
}

export default IState;
