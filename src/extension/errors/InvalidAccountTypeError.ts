// enums
import { ErrorCodeEnum } from '../enums';

// errors
import BaseExtensionError from './BaseExtensionError';

export default class InvalidAccountTypeError extends BaseExtensionError {
  public readonly code: ErrorCodeEnum = ErrorCodeEnum.InvalidAccountTypeError;
  public readonly name: string = 'InvalidAccountTypeError';
}
