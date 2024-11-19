// errors
import { BaseExtensionError } from '@extension/errors';

// types
import type { IAccountPasskey } from '@extension/types';

interface IState {
  addPasskeyAccountAction: () => Promise<boolean>;
  error: BaseExtensionError | null;
  passkey: IAccountPasskey | null;
  requesting: boolean;
  resetAction: () => void;
}

export default IState;
