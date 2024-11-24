// enums
import { ErrorCodeEnum } from '@common/enums';

// errors
import BaseExtensionError from './BaseExtensionError';

export default class AuthInvalidPublicKeyError extends BaseExtensionError {
  public readonly code: ErrorCodeEnum = ErrorCodeEnum.AuthInvalidPublicKeyError;
  public readonly name: string = 'AuthInvalidPublicKeyError';
}
