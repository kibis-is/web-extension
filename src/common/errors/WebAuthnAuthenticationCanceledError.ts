// enums
import { ErrorCodeEnum } from '@common/enums';

// errors
import BaseExtensionError from './BaseExtensionError';

export default class WebAuthnAuthenticationCanceledError extends BaseExtensionError {
  public readonly code: ErrorCodeEnum =
    ErrorCodeEnum.WebAuthnAuthenticationCanceledError;
  public readonly name = 'WebAuthnAuthenticationCanceledError';
}
