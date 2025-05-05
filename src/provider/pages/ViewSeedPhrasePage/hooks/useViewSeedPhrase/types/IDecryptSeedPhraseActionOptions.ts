// errors
import { BaseExtensionError } from '@common/errors';

// types
import type { IAccountWithExtendedProps, TEncryptionCredentials } from '@provider/types';

interface IDecryptSeedPhraseActionOptions {
  account: IAccountWithExtendedProps;
  credentials: TEncryptionCredentials | null;
  onError: (error: BaseExtensionError) => void;
}

export default IDecryptSeedPhraseActionOptions;
