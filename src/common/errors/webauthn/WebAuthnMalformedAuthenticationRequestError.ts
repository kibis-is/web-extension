// enums
import { ErrorCodeEnum } from '@common/enums';

// errors
import { BaseExtensionError } from '@common/errors';

export default class WebAuthnMalformedAuthenticationRequestError extends BaseExtensionError {
  public readonly code: ErrorCodeEnum =
    ErrorCodeEnum.WebAuthnMalformedAuthenticationRequestError;
  public readonly name = 'WebAuthnMalformedAuthenticationRequestError';
}
