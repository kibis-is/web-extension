// errors
import { BaseExtensionError } from '@common/errors';

// types
import type {
  IOptions,
  IResult,
} from '@client/managers/WebAuthnMessageManager';

interface IState {
  authenticateAction: (
    options: IOptions<PublicKeyCredentialRequestOptions>
  ) => Promise<void>;
  error: BaseExtensionError | null;
  registerAction: (
    options: IOptions<PublicKeyCredentialCreationOptions>
  ) => Promise<void>;
  result: IResult | null;
}

export default IState;
