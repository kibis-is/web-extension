// enums
import { ErrorCodeEnum } from '@common/enums';

// errors
import BaseExtensionError from './BaseExtensionError';

export default class WebAuthnInvalidPasskeyError extends BaseExtensionError {
  public readonly code: ErrorCodeEnum =
    ErrorCodeEnum.WebAuthnInvalidPasskeyError;
  public readonly name: string = 'WebAuthnInvalidPasskeyError';
}
