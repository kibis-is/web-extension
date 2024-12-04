// enums
import { ErrorCodeEnum } from '@common/enums';

// errors
import BaseExtensionError from './BaseExtensionError';

export default class WebAuthnInvalidPublicKeyError extends BaseExtensionError {
  public readonly code: ErrorCodeEnum =
    ErrorCodeEnum.WebAuthnInvalidPublicKeyError;
  public readonly name: string = 'WebAuthnInvalidPublicKeyError';
}
