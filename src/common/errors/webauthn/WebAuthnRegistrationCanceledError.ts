// enums
import { ErrorCodeEnum } from '@common/enums';

// errors
import { BaseExtensionError } from '@common/errors';

export default class WebAuthnRegistrationCanceledError extends BaseExtensionError {
  public readonly code: ErrorCodeEnum =
    ErrorCodeEnum.WebAuthnRegistrationCanceledError;
  public readonly name: string = 'WebAuthnRegistrationCanceledError';
}
