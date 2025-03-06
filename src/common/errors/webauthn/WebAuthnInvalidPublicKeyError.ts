// enums
import { ErrorCodeEnum } from '@common/enums';

// errors
import { BaseExtensionError } from '@common/errors';

export default class WebAuthnInvalidPublicKeyError extends BaseExtensionError {
  public readonly code: ErrorCodeEnum =
    ErrorCodeEnum.WebAuthnInvalidPublicKeyError;
  public readonly name: string = 'WebAuthnInvalidPublicKeyError';
}
