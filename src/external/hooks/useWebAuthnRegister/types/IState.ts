// errors
import { BaseExtensionError } from '@common/errors';

// types
import type {
  IRegisterOptions,
  IRegisterResult,
} from '@external/managers/WebAuthnMessageManager';

interface IState {
  error: BaseExtensionError | null;
  registerAction: (options: IRegisterOptions) => Promise<void>;
  result: IRegisterResult | null;
}

export default IState;
