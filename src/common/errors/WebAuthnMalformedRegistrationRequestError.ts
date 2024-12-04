// enums
import { ErrorCodeEnum } from '@common/enums';

// errors
import BaseExtensionError from './BaseExtensionError';

export default class WebAuthnMalformedRegistrationRequestError extends BaseExtensionError {
  public readonly code: ErrorCodeEnum =
    ErrorCodeEnum.WebAuthnMalformedRegistrationRequestError;
  public readonly name: string = 'WebAuthnMalformedRegistrationRequestError';
}
