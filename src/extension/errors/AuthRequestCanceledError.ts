// enums
import { ErrorCodeEnum } from '../enums';

// errors
import BaseExtensionError from './BaseExtensionError';

export default class AuthRequestCanceledError extends BaseExtensionError {
  public readonly code: ErrorCodeEnum = ErrorCodeEnum.AuthRequestCanceledError;
  public readonly name: string = 'AuthRequestCanceledError';
}
