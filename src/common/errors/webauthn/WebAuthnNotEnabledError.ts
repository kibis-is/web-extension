// enums
import { ErrorCodeEnum } from '@common/enums';

// errors
import { BaseExtensionError } from '@common/errors';

export default class WebAuthnNotEnabledError extends BaseExtensionError {
  public readonly code: ErrorCodeEnum = ErrorCodeEnum.WebAuthnNotEnabledError;
  public readonly name: string = 'WebAuthnNotEnabledError';
}
