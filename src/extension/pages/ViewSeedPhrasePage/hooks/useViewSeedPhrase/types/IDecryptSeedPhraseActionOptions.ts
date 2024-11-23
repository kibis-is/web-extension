// errors
import { BaseExtensionError } from '@common/errors';

// types
import type {
  IAccountWithExtendedProps,
  TEncryptionCredentials,
} from '@extension/types';

interface IDecryptSeedPhraseActionOptions {
  account: IAccountWithExtendedProps;
  credentials: TEncryptionCredentials | null;
  onError: (error: BaseExtensionError) => void;
}

export default IDecryptSeedPhraseActionOptions;
